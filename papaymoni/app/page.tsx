import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Link href="/register" className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium" target="_blank">
              Get Started Today
            </Link>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Automated P2P Cryptocurrency Trading
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Papay Moni is a middleware platform that automates peer-to-peer cryptocurrency trading on Bybit for both
              merchants and regular users.
            </p>
            <div className="space-x-4">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                Get Started
              </Link>
              <Link href="/features" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Learn More
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Papay Moni leverages Bybit&apos;s Open API to facilitate seamless asset buying and selling without
              requiring manual intervention.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.wallet className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Automated Trading</h3>
                  <p className="text-sm text-muted-foreground">
                    Executes P2P buy and sell orders on Bybit on behalf of users
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.shield className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">API Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connects to users&apos; Bybit accounts via their API keys and signatures
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.creditCard className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Virtual Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Provides static virtual accounts for deposits and withdrawals
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.arrowDown className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Buy Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    &quot;Buy&quot; corresponds to withdrawals from your account
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.arrowUp className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Sell Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    &quot;Sell&quot; corresponds to deposits into your account
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.dollar className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Commission-based Revenue</h3>
                  <p className="text-sm text-muted-foreground">
                    1.2% commission on each successful trade (capped at 1,200 NGN)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">How It Works</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Papay Moni simplifies the P2P cryptocurrency trading process
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
            <div className="mx-auto flex w-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">1</div>
                <h3 className="text-xl font-bold">Register & Connect</h3>
              </div>
              <p className="text-muted-foreground">
                Create an account on Papay Moni and securely connect your Bybit API credentials.
              </p>
            </div>
            <div className="mx-auto flex w-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">2</div>
                <h3 className="text-xl font-bold">Create Virtual Accounts</h3>
              </div>
              <p className="text-muted-foreground">
                Set up virtual accounts for seamless deposits and withdrawals in your local currency.
              </p>
            </div>
            <div className="mx-auto flex w-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">3</div>
                <h3 className="text-xl font-bold">Trade Automatically</h3>
              </div>
              <p className="text-muted-foreground">
                The platform automatically processes buy and sell orders on Bybit on your behalf.
              </p>
            </div>
            <div className="mx-auto flex w-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">4</div>
                <h3 className="text-xl font-bold">Manage Your Portfolio</h3>
              </div>
              <p className="text-muted-foreground">
                Track your transactions, monitor your balance, and grow your cryptocurrency portfolio.
              </p>
            </div>
          </div>
        </section>
        <section id="testimonials" className="bg-slate-50 py-8 dark:bg-slate-900 md:py-12 lg:py-24">
          <div className="container">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Trusted by Traders</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Here&apos;s what our users have to say about Papay Moni
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4 rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary" />
                  <div>
                    <h4 className="font-bold">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Crypto Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Papay Moni has revolutionized how I trade crypto. The automated system saves me hours every day."
                </p>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary" />
                  <div>
                    <h4 className="font-bold">Jane Smith</h4>
                    <p className="text-sm text-muted-foreground">Business Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The virtual accounts feature makes it incredibly easy to manage my cryptocurrency transactions."
                </p>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary" />
                  <div>
                    <h4 className="font-bold">Michael Johnson</h4>
                    <p className="text-sm text-muted-foreground">Investor</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I've tried many platforms, but Papay Moni's integration with Bybit is seamless and reliable."
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Ready to Get Started?</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join Papay Moni today and experience the future of P2P cryptocurrency trading.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className={buttonVariants({ size: "lg" })}>
                Sign Up Now
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
