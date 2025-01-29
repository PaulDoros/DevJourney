import { ComponentShowcase } from '~/components/Learning/ComponentShowcase';

export default function GettingStartedRoute() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
          Remix Features
        </h2>
        <ComponentShowcase />
      </section>
    </div>
  );
}
