import Image from 'next/image';
import WaitlistForm from '@/components/WaitlistForm';

export default function Home() {
  return (
    <main>
      <div className="page">
        <header>
          <Image
            src="/actionpackd-logo.png.png"
            alt="Actionpackd logo"
            width={206}
            height={68}
            priority
          />
        </header>

        <section className="hero">
          <div>
            <h1>Move Fast, Build Things</h1>
            <p>Build, ship, and iterate with agents — right from your terminal.</p>
          </div>
          <WaitlistForm />
        </section>
      </div>
    </main>
  );
}
