import { rmSync } from 'node:fs';

import { LANDSCAPE, PLOT_INSET } from '../src/components/charts/chart-geometry';

/**
 * Measures every figure of Analyze and Design in a real browser, on screen
 * and on paper.
 *
 * A chart is drawn by ECharts into a box the page lays out, and a keyboard is
 * drawn beside it by the application: the two agree only as long as they are
 * given the same width. Nothing in the type system or the unit tests says so,
 * and the figures have come apart three times — once on paper, once on
 * screen, once on a sheet the reader had chosen in the print dialog — because
 * a change elsewhere moved one of them.
 *
 * So this walks the ten pages that carry a figure in six windows, prints them
 * for real from three of those, and measures what the browser actually laid
 * out. The printing matters: a print is the one moment the page is laid out
 * against something other than the window, and nothing short of printing
 * reproduces it.
 *
 * It starts a browser of its own for each window, on a port the system picks,
 * so it can never measure the pages of a browser that was already open.
 *
 * Run it against a server you have already started:
 *
 *     bun run scripts/check-figures.ts            # http://localhost:3000
 *     bun run scripts/check-figures.ts http://…   # somewhere else
 */

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';

/**
 * The windows the figures are laid out in, and the zoom the reader is at.
 *
 * A reader who has pressed ctrl+ once keeps that zoom for the host, and the
 * print layout hands every rectangle back at it while still giving the sheet
 * at none. A figure that measured one against the other without noticing
 * came out a tenth short of its sheet for every tenth of zoom.
 */
interface View {
  height: number;
  /** A window that prints nothing a wider one has not already proved. */
  onPaper?: boolean;
  width: number;
  zoom: number;
}

const VIEWS: View[] = [
  { height: 1100, width: 1280, zoom: 1 },
  { height: 1100, width: 1920, zoom: 1 },
  { height: 1100, width: 1536, zoom: 1.1 },
  // A sheet is laid out against the paper, not against the window, so these
  // only have to hold on screen: a phone, the width the sidebar opens at,
  // and a window taller than it is wide.
  { height: 844, onPaper: false, width: 390, zoom: 1 },
  { height: 1024, onPaper: false, width: 768, zoom: 1 },
  { height: 1203, onPaper: false, width: 706, zoom: 1 },
];

const PAGES = [
  '/analyze/touch-weight',
  '/analyze/front-weight',
  '/analyze/strike-weight',
  '/analyze/strike-weight-ratio',
  '/analyze/wippen-support-springs',
  // The Design pages carry the same figure under a recap of the four
  // parameters, which is room the figure does not have.
  '/design/wippen-support-springs',
  '/design/front-weight',
  '/design/strike-weight',
  '/design/strike-weight-ratio',
  '/design/touch-weight-preview',
];

/**
 * The sheets a figure has to come out right on.
 *
 * The second is the reader's: the margins and the paper of the print dialog
 * override what the stylesheet asks for, and a figure sized for the sheet the
 * stylesheet had in mind then leaves a band of white beside it.
 */
const STYLESHEET_SHEET = {
  margin: null,
  name: 'the sheet the stylesheet asks for',
};
const READERS_SHEET = { margin: '0mm', name: 'a sheet the reader chose' };
const SHEETS = [STYLESHEET_SHEET, READERS_SHEET];

/** The tallest plot the design draws unaided. */
const DESIGNED_PLOT = 384;
/** Half a pixel of rounding on each side is not a misalignment. */
const TOLERANCE = 1.5;
/** What a figure may leave of its sheet unused, once it has filled it. */
const UNUSED_SHEET = 16;

interface Box {
  bottom: number;
  height: number;
  left: number;
  right: number;
  width: number;
}

interface Measurement {
  box: Box | null;
  /** How far right the chart last drew its grid, in its own coordinates. */
  drawnRight: number | null;
  figureFoot: number | null;
  keyboard: Box | null;
  pageHeight: number;
  /** How far the page runs off the side of the window, if it does. */
  pageOverflow: number;
  pageWidth: number;
  /** What the reader's zoom turned out to be, read off the page itself. */
  zoom: number;
  /** The shape the drawing carries, and the marks the stylesheet fits by. */
  shape: {
    boxSlot: string | null;
    /** The shape it would have to carry to fit its box without moving a mark. */
    drawnSize: string;
    slot: string | null;
    viewBox: string | null;
  } | null;
  svg: Box | null;
}

/** Runs in the page: what the browser actually laid out. */
const MEASURE = `(() => {
  const plot = document.querySelector('[data-slot="chart-plot"]');
  // The box ECharts owns, not an overlay drawn over the same grid.
  const container = plot?.querySelector('[_echarts_instance_]');
  const figure = plot?.closest('[data-slot="chart-figure"]');
  // Rectangles come back at the reader's zoom while the sheet is given at
  // none, so everything is put into the sheet's own pixels before it is
  // compared with anything.
  const root = document.documentElement;
  const drawn = root.getBoundingClientRect().width;
  const scale = drawn > 0 ? root.clientWidth / drawn : 1;
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      bottom: +(r.bottom * scale).toFixed(1), height: +(r.height * scale).toFixed(1),
      left: +(r.left * scale).toFixed(1), right: +(r.right * scale).toFixed(1),
      width: +(r.width * scale).toFixed(1),
    };
  };
  // The rules ECharts drew, which say how wide it believes its plot to be.
  // That is its last drawing, and a drawing is a frame behind the box it is
  // in unless the renderer was told to catch up.
  const rules = [...(container?.querySelectorAll('svg path') ?? [])]
    .map((line) => /^M([\\d.]+) ([\\d.]+)L([\\d.]+) \\2$/.exec(line.getAttribute('d') || ''))
    .filter(Boolean);
  const drawing = container?.querySelector('svg');
  return {
    box: rect(container),
    drawnRight: rules.length ? Math.max(...rules.map((rule) => Number(rule[3]))) : null,
    figureFoot: figure?.lastElementChild
      ? +(figure.lastElementChild.getBoundingClientRect().bottom * scale).toFixed(1)
      : null,
    keyboard: rect(plot?.querySelector('[data-slot="chart-keyboard"]')),
    pageHeight: root.clientHeight,
    pageOverflow: root.scrollWidth - root.clientWidth,
    pageWidth: root.clientWidth,
    zoom: +scale.toFixed(3),
    shape: drawing && {
      boxSlot: drawing.parentElement?.dataset.slot ?? null,
      drawnSize: '0 0 ' + drawing.getAttribute('width') + ' ' + drawing.getAttribute('height'),
      slot: drawing.dataset.slot ?? null,
      viewBox: drawing.getAttribute('viewBox'),
    },
    svg: rect(drawing),
  };
})()`;

/**
 * What a sheet looks like when the browser lays the page out once more after
 * the last turn of script: a drawing of the old size in a box of the new one.
 *
 * Nothing reproduces that in a browser that can be driven, so it is staged —
 * the drawing is marked as a printing figure marks it, then shrunk — and what
 * is checked is the one thing that saves such a sheet: the print stylesheet
 * stretching the drawing back over its box. Everything is put back after.
 */
const STAGE_A_WIDER_BOX = `(() => {
  const container = document.querySelector('[data-slot="chart-plot"] [_echarts_instance_]');
  const drawing = container?.querySelector('svg');
  const box = drawing?.parentElement;
  if (!container || !drawing || !box) return null;
  const was = {
    boxWidth: box.style.width,
    height: drawing.getAttribute('height'),
    width: drawing.getAttribute('width'),
  };
  drawing.setAttribute('viewBox', '0 0 ' + was.width + ' ' + was.height);
  drawing.setAttribute('preserveAspectRatio', 'none');
  drawing.dataset.slot = 'chart-drawing';
  box.dataset.slot = 'chart-drawing-box';
  box.style.width = '400px';
  drawing.setAttribute('width', '400');
  const measured = {
    container: +container.getBoundingClientRect().width.toFixed(1),
    drawing: +drawing.getBoundingClientRect().width.toFixed(1),
  };
  box.style.width = was.boxWidth;
  drawing.setAttribute('width', was.width);
  drawing.removeAttribute('viewBox');
  drawing.removeAttribute('preserveAspectRatio');
  delete drawing.dataset.slot;
  delete box.dataset.slot;
  return measured;
})()`;

/**
 * Keeps what the page measured of itself at each turn of a print: the size it
 * gave the figure before anything was laid out for paper, and the whole of it
 * once the page was on paper.
 */
const WATCH_PRINT = `(() => {
  window.__onPaper = null;
  window.__firstSize = null;
  // After the figure's own listener, which has been subscribed since it was
  // drawn: what is read here is the size it has just settled on.
  window.addEventListener('beforeprint', () => {
    const drawing = document.querySelector('[data-slot="chart-plot"] [_echarts_instance_] svg');
    window.__firstSize = drawing ? Number(drawing.getAttribute('width')) : null;
  });
  window.matchMedia('print').addEventListener('change', (event) => {
    if (event.matches) {
      window.__onPaper = ${MEASURE};
    }
  });
  return 'ok';
})()`;

/** What the print dialog does when the reader picks margins of their own. */
const overrideMargins = (margin: string | null) => `(() => {
  const id = 'ptl-check-figures-sheet';
  document.getElementById(id)?.remove();
  ${JSON.stringify(margin)} === null ? null : (() => {
    const style = document.createElement('style');
    style.id = id;
    style.media = 'print';
    style.textContent = '@page { margin: ' + ${JSON.stringify(margin)} + ' }';
    document.head.appendChild(style);
  })();
  return 'ok';
})()`;

/**
 * How many sheets a printed page took, read off the PDF the browser made.
 *
 * Worth reading rather than deducing from the page: the browser settles how
 * many sheets it will use the first time it lays the page out, and a figure
 * that has since been measured back onto the first sheet leaves a blank
 * second one behind that nothing in the DOM says anything about. Skia writes
 * one `/Type /Page` object per sheet.
 */
const sheetsIn = (pdf: string): number =>
  (
    Buffer.from(pdf, 'base64')
      .toString('latin1')
      .match(/\/Type\s*\/Page[^s]/g) ?? []
  ).length;

const failures: string[] = [];
const skipped: string[] = [];
/** One for every figure measured, on screen or on a sheet. */
let measured = 0;

const check = (where: string, claim: string, ok: boolean, detail: string) => {
  if (!ok) {
    failures.push(`${where}: ${claim} — ${detail}`);
  }
};

/** Everything that must hold of a figure, whatever it is laid out against. */
const checkFigure = (where: string, measured: Measurement) => {
  const { box, keyboard, svg } = measured;
  if (!box || !keyboard || !svg) {
    failures.push(`${where}: nothing was laid out to measure`);
    return;
  }
  check(
    where,
    'the chart fills its box',
    Math.abs(svg.width - box.width) <= TOLERANCE,
    `chart ${svg.width} vs box ${box.width}`,
  );
  check(
    where,
    'the chart has drawn itself at the width of its box',
    measured.drawnRight !== null &&
      Math.abs(measured.drawnRight - (box.width - PLOT_INSET.right)) <=
        TOLERANCE,
    `drawn to ${measured.drawnRight} instead of ${box.width - PLOT_INSET.right}`,
  );
  check(
    where,
    'the keyboard is inset by the left margin of the plot',
    Math.abs(keyboard.left - box.left - PLOT_INSET.left) <= TOLERANCE,
    `${(keyboard.left - box.left).toFixed(1)} instead of ${PLOT_INSET.left}`,
  );
  check(
    where,
    'the keyboard is inset by the right margin of the plot',
    Math.abs(box.right - keyboard.right - PLOT_INSET.right) <= TOLERANCE,
    `${(box.right - keyboard.right).toFixed(1)} instead of ${PLOT_INSET.right}`,
  );
};

/**
 * A browser already carrying the reader's zoom for this host.
 *
 * A page zoom belongs to the profile, not to the page: it cannot be asked for
 * over the wire, so it is written into a profile of its own and the browser
 * is started on it. Chrome counts zoom in steps of 1.2.
 */
const openBrowser = async (zoom: number) => {
  const profile = `/tmp/ptl-check-figures-${process.pid}-${Math.round(zoom * 100)}`;
  // Left over from a run that was interrupted: its port file would be read as
  // this browser's.
  rmSync(profile, { force: true, recursive: true });
  await Bun.write(
    `${profile}/Default/Preferences`,
    JSON.stringify({
      partition: {
        per_host_zoom_levels: {
          x: { localhost: { zoom_level: Math.log(zoom) / Math.log(1.2) } },
        },
      },
    }),
  );
  const chrome = Bun.spawn(
    [
      'google-chrome-stable',
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      // Whatever port is free: the browser writes down the one it took.
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
    ],
    { stderr: 'ignore', stdout: 'ignore' },
  );
  return { chrome, profile };
};

/** The port the browser took, once it has written it down. */
const debuggingPort = async (profile: string): Promise<number> => {
  const [port] = (await Bun.file(`${profile}/DevToolsActivePort`).text()).split(
    '\n',
  );
  if (!port) {
    throw new Error('no port yet');
  }
  return Number(port);
};

const waitFor = async <T>(
  attempt: () => Promise<T>,
  tries = 40,
): Promise<T> => {
  for (let index = 0; index < tries; index += 1) {
    try {
      return await attempt();
    } catch {
      await Bun.sleep(100);
    }
  }
  throw new Error('the browser never answered');
};

const targets = (port: number): Promise<{ webSocketDebuggerUrl: string }> =>
  fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: 'PUT',
  }).then(
    (response) => response.json() as Promise<{ webSocketDebuggerUrl: string }>,
  );

const connect = async (url: string) => {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map<number, (result: unknown) => void>();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data)) as {
      id?: number;
      result?: unknown;
    };
    if (message.id !== undefined) {
      pending.get(message.id)?.(message.result);
      pending.delete(message.id);
    }
  });

  const send = (method: string, params: Record<string, unknown> = {}) => {
    const id = (nextId += 1);
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise<Record<string, unknown>>((resolve) => {
      pending.set(id, resolve as (result: unknown) => void);
    });
  };

  const evaluate = async <T>(expression: string): Promise<T> => {
    const answer = (await send('Runtime.evaluate', {
      awaitPromise: true,
      expression,
      returnByValue: true,
    })) as { result?: { value?: T } };
    return answer.result?.value as T;
  };

  return { close: () => socket.close(), evaluate, send };
};

for (const view of VIEWS) {
  const browser = await openBrowser(view.zoom);
  try {
    const port = await waitFor(() => debuggingPort(browser.profile));
    const target = await waitFor(() => targets(port));
    const page = await connect(target.webSocketDebuggerUrl);

    // A first visit loads the demonstration piano, so the figures have data.
    await page.send('Page.navigate', { url: `${ORIGIN}/` });
    await Bun.sleep(2500);
    await page.send('Emulation.setDeviceMetricsOverride', {
      deviceScaleFactor: 1,
      height: view.height,
      mobile: false,
      width: view.width,
    });

    for (const path of PAGES) {
      await page.send('Page.navigate', { url: `${ORIGIN}${path}` });
      await Bun.sleep(1800);

      const size = `${view.width}×${view.height}px`;
      const where =
        view.zoom === 1
          ? `${path} at ${size}`
          : `${path} at ${size}, zoomed to ${Math.round(view.zoom * 100)}%`;
      const screen = await page.evaluate<Measurement>(MEASURE);
      if (!screen.box || !screen.svg || !screen.keyboard) {
        // A page whose measurement option is off shows an empty state instead.
        skipped.push(where);
        continue;
      }
      measured += 1;
      checkFigure(where, screen);
      check(
        where,
        'the page keeps to the window',
        screen.pageOverflow <= TOLERANCE,
        `${screen.pageOverflow}px of it off the right`,
      );
      // A figure may be given the room a tall window leaves under it, but not
      // to the point of drawing eighty-eight keys into a square.
      check(
        where,
        'the plot is read across rather than down',
        screen.box.height <=
          Math.max(DESIGNED_PLOT, screen.box.width / LANDSCAPE) + TOLERANCE,
        `${screen.box.height} tall in ${screen.box.width}`,
      );

      if (view.onPaper === false) {
        continue;
      }

      await page.evaluate(WATCH_PRINT);
      let readersSheetBox: number | null = null;
      for (const sheet of SHEETS) {
        await page.evaluate(overrideMargins(sheet.margin));
        const pdf = (await page.send('Page.printToPDF', {
          preferCSSPageSize: true,
        })) as { data: string };
        await Bun.sleep(250);

        const printed = await page.evaluate<Measurement | null>(
          'window.__onPaper',
        );
        const onPaper = `${where}, on ${sheet.name}`;
        if (!printed) {
          failures.push(`${onPaper}: the page never went to paper`);
          continue;
        }
        measured += 1;
        checkFigure(onPaper, printed);
        check(
          onPaper,
          "the reader's zoom is in force, or this proves nothing",
          Math.abs(printed.zoom - view.zoom) <= 0.02,
          `laid out at ${printed.zoom} where the reader is at ${view.zoom}`,
        );
        check(
          onPaper,
          'the drawing carries its own shape, to be fitted to whatever box it lands in',
          printed.shape?.viewBox === printed.shape?.drawnSize &&
            printed.shape?.slot === 'chart-drawing' &&
            printed.shape?.boxSlot === 'chart-drawing-box',
          `shape ${printed.shape?.viewBox} of a drawing ${printed.shape?.drawnSize}`,
        );
        readersSheetBox = printed.box?.width ?? null;
        const unused = printed.pageHeight - (printed.figureFoot ?? 0);
        check(
          onPaper,
          'the figure fills the sheet',
          unused >= 0 && unused <= UNUSED_SHEET,
          `${unused.toFixed(1)}px of the sheet left over`,
        );
        check(
          onPaper,
          'the figure keeps to one sheet',
          sheetsIn(pdf.data) === 1,
          `${sheetsIn(pdf.data)} sheets printed`,
        );
      }
      // A second print on the reader's sheet starts from that sheet, not from
      // the one the stylesheet asked for. It is the first size that reaches
      // the paper when the browser lays the page out once more afterwards,
      // and the only one it can be told in time.
      await page.evaluate(overrideMargins(READERS_SHEET.margin));
      await page.evaluate('window.__firstSize = null');
      await page.send('Page.printToPDF', { preferCSSPageSize: true });
      await Bun.sleep(250);
      const firstSize = await page.evaluate<number | null>(
        'window.__firstSize',
      );
      check(
        where,
        'a print starts from the sheet the last one really had',
        firstSize !== null &&
          readersSheetBox !== null &&
          Math.abs(firstSize - readersSheetBox) <= TOLERANCE,
        `${firstSize} instead of the ${readersSheetBox} that sheet gave it`,
      );

      await page.evaluate(overrideMargins(null));
      await Bun.sleep(150);

      // And comes back: a figure left at the width of a sheet is the bug a
      // reader meets after cancelling a print.
      const back = await page.evaluate<Measurement>(MEASURE);
      check(
        where,
        'the chart is itself again once the printing is over',
        back.svg !== null &&
          Math.abs(back.svg.width - screen.svg.width) <= TOLERANCE,
        `chart ${back.svg?.width} instead of ${screen.svg.width}`,
      );
      check(
        where,
        'the drawing has its own size back, and is not left a shape to be scaled',
        back.shape?.viewBox === null && back.shape?.slot === null,
        `shape ${back.shape?.viewBox} left behind`,
      );

      // And the stylesheet catches a sheet the measuring never reached.
      await page.send('Emulation.setEmulatedMedia', { media: 'print' });
      const staged = await page.evaluate<{
        container: number;
        drawing: number;
      } | null>(STAGE_A_WIDER_BOX);
      await page.send('Emulation.setEmulatedMedia', { media: '' });
      check(
        where,
        'a drawing left at the wrong size is still stretched over its box',
        staged !== null &&
          Math.abs(staged.drawing - staged.container) <= TOLERANCE,
        `drawing ${staged?.drawing} in a box of ${staged?.container}`,
      );
    }

    page.close();
  } finally {
    browser.chrome.kill();
    await browser.chrome.exited;
    rmSync(browser.profile, { force: true, recursive: true });
  }
}

if (failures.length > 0) {
  console.error(`${failures.length} figure(s) out of line:\n`);
  for (const failure of failures) {
    console.error(`  ✗ ${failure}`);
  }
  process.exit(1);
}

for (const where of skipped) {
  console.log(`  — ${where}: no figure on this profile, skipped`);
}
console.log(`${measured} figures measured, all in line.`);
