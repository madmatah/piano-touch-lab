import { MainLayout } from '../MainLayout';

export const Homepage = () => {
  return (
    <MainLayout>
      <section className="py-10">
        <div className="container">
          <div className="flex flex-col gap-5">
            <div className="relative flex flex-col gap-5">
              <h2 className="mx-auto max-w-5xl text-center text-3xl font-medium text-balance md:text-6xl">
                Piano Touch Lab
              </h2>
              <p className="mx-auto max-w-3xl text-center text-muted-foreground md:text-lg">
                A toolkit for calculating grand piano action balancing
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
