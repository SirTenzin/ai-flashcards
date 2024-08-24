// make a landing page here
'use client'
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <CloudLightningIcon className="h-6 w-6" />
          <span className="sr-only">Flashcard AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-secondary">
          <div className="container px-4 md:px-6 flex justify-center items-center">
            <div className="space-y-4 text-primary-foreground text-center max-w-[800px]">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Effortless Flashcard Creation
              </h1>
              <p className="md:text-xl">
                Unleash your learning potential with our AI-powered flashcard generator. Streamline your study sessions
                and boost your knowledge retention.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/authenticate"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Unlock Your Learning Potential</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered flashcard generator helps you create personalized study materials, track your progress,
                  and optimize your learning experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <svg
                width="550"
                height="310"
                viewBox="0 0 550 310"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="100%" height="100%" className="fill-background dark:fill-muted" />
                <circle cx="275" cy="155" r="100" className="fill-primary dark:fill-secondary" />
                <text x="275" y="155" textAnchor="middle" className="fill-white dark:fill-gray-900" fontSize="24" fontWeight="bold" dy=".3em">
                  Flashcards
                </text>
              </svg>
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">AI-Powered Generation</h3>
                      <p className="text-muted-foreground">
                        Our advanced AI algorithms create personalized flashcards tailored to your learning needs.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Progress Tracking</h3>
                      <p className="text-muted-foreground">
                        Monitor your learning progress and identify areas for improvement.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Adaptive Learning</h3>
                      <p className="text-muted-foreground">
                        Our platform adapts to your learning style and pace, ensuring optimal knowledge retention.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Flexible Pricing for Every Learner</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that best suits your learning needs and budget. Upgrade or downgrade anytime.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center justify-center gap-6 py-12 md:grid-cols-1 md:gap-8 lg:gap-12">
              <Card className="p-6 space-y-4 bg-background shadow-sm transition-all hover:shadow-md">
                <div className="space-y-1 text-center">
                  <h3 className="text-2xl font-bold">Pro (3 day free trial, $10/month)</h3>
                  <p className="text-muted-foreground">Unlock more features</p>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-4xl font-bold">$9</p>
                  <p className="text-muted-foreground text-sm">per month</p>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Unlimited flashcards</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Advanced progress tracking (soon)</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Export to Anki</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Custom templates (soon)</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                {/* <Button className="w-full" onClick={() => {
                    window.open("https://buy.stripe.com/test_7sI2bPgYY5y5cuY144", "_blank")
                }}>Subscribe</Button> */}
                
                <div className="flex justify-center">
                    {/* @ts-ignore */}
                    <stripe-buy-button
                    buy-button-id="buy_btn_1PotplIwNxKQwOrv5oNciadA"
                    publishable-key="pk_test_51PotHxIwNxKQwOrvZ1gqKKcdMuMFSzYtqRtoWOYVb0pk3XBgZ4XLCuVGpHSrzyydu25mFVF2Des3PhYnSXySVeAt00Luj9OcZK"
                    >
                    {/* @ts-ignore */}
                    </stripe-buy-button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Flashcard AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
    )
}

function CheckIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
  
  
  function CloudLightningIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
        <path d="m13 12-3 5h4l-3 5" />
      </svg>
    )
  }

export default LandingPage;