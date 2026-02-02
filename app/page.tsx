import Link from "next/link";

export default function Home() {
    return (
        <main className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-8 flex flex-col justify-center min-h-screen">
            {/* Top Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Product Intro */}
                <article className="glass-panel lg:col-span-2 rounded-3xl p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl tracking-tight mb-4 text-white drop-shadow-md font-bold">
                        Embeddable RAG Chatbot
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed max-w-2xl">
                        Deploy custom AI support agents to your website in minutes. Powered by your data.
                    </p>
                </article>

                {/* Right Card: Authentication */}
                <article className="glass-panel rounded-3xl p-8 flex flex-col justify-center items-center space-y-6">
                    <Link href="/login" className="w-full">
                        <button className="btn-login w-full py-3 px-6 rounded-xl text-blue-100 font-medium tracking-wide shadow-sm hover:text-white" type="button">
                            Log In
                        </button>
                    </Link>
                    <Link href="/signup" className="w-full">
                        <button className="btn-signup w-full py-3 px-6 rounded-xl text-white font-semibold tracking-wide" type="button">
                            Sign Up
                        </button>
                    </Link>
                </article>
            </section>

            {/* Bottom Section */}
            <section className="glass-panel rounded-3xl p-4 sm:p-6 min-h-[400px] flex flex-col">
                <div className="glass-inner rounded-xl h-16 w-full mb-6"></div>
                <div className="flex-grow w-full" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '100%' }}>
                    <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                    <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                    <div></div>
                </div>
            </section>
        </main>
    );
}
