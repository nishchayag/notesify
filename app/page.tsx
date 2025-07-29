"use client";

import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col items-center px-6 py-16">
      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-5 right-5"
      >
        <ModeToggle />
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="max-w-3xl text-center mt-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-wrap">
          Capture ideas, <br />
          jot thoughts, <br />
          stay organized effortlessly.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Notesify is your personal note-taking space clean, fast, and made for
          focus. Perfect for students, creators, and anyone who thinks better in
          words.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: "PenSquare",
            title: "Markdown Support",
            desc: "Write with rich formatting and preview instantly.",
          },
          {
            icon: "Lock",
            title: "Private & Secure",
            desc: "Your notes stay yours. Fully protected with auth.",
          },
          {
            icon: "Tags",
            title: "Tag & Search",
            desc: "Quickly find anything with built-in tags and smart filters.",
          },
        ].map((feature) => {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const Icon = require("lucide-react")[feature.icon];
          return (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col gap-4 p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Dashboard Preview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
        className="mt-32 w-full max-w-5xl bg-card border rounded-2xl shadow-md overflow-hidden"
      >
        <div className="bg-muted px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Your Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Here’s what your /notes dashboard looks like.
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-background border rounded-xl p-4 hover:shadow transition"
            >
              <h3 className="font-semibold text-lg">Note Title {i}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aliquid, maiores. Sit officiis quas eos minus soluta temporibus.
              </p>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>Tag: Work</span>
                <span>Edited: 2d ago</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-32 text-center"
      >
        <h2 className="text-3xl font-bold">Ready to take smarter notes?</h2>
        <p className="text-muted-foreground mt-2">
          Join Notesify for free and start writing instantly.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/register">Create an account</Link>
        </Button>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-32 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              question: "Is Notesify free to use?",
              answer:
                "Yes! Notesify is 100% free with all core features available to everyone.",
            },
            {
              question: "Can I access my notes on multiple devices?",
              answer:
                "Absolutely. Your notes sync instantly and are available anywhere.",
            },
            {
              question: "Is my data secure?",
              answer:
                "All notes are private by default and protected through secure authentication.",
            },
            {
              question: "Does Notesify support Markdown?",
              answer:
                "Yes, Markdown is fully supported. You can write, format, and preview instantly.",
            },
            {
              question: "Will there be a mobile app?",
              answer:
                "Yes, we're working on a mobile version. Join our waitlist to get early access!",
            },
            {
              question: "Can I share notes with others?",
              answer:
                "Public sharing is coming soon! For now, all notes remain private to you.",
            },
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-32 w-full max-w-4xl text-center"
      >
        <h2 className="text-3xl font-bold mb-6">
          Loved by note-takers everywhere
        </h2>

        <div className="overflow-hidden w-full">
          <div className="flex animate-scroll-snap space-x-8 px-4">
            {[
              {
                name: "Aanya Patel",
                role: "Student at NYU",
                quote:
                  "Notesify is the cleanest note app I’ve ever used. It keeps me focused.",
              },
              {
                name: "Rohan Mehta",
                role: "YouTube Creator",
                quote:
                  "I can write scripts and tag them super easily. Markdown is a bonus!",
              },
              {
                name: "Emily Zhao",
                role: "Developer & Blogger",
                quote:
                  "Notesify became my second brain. Simple, elegant, and lightning fast.",
              },
              {
                name: "Carlos Jiménez",
                role: "Product Manager",
                quote:
                  "I use Notesify to jot down user insights during interviews. It just works.",
              },
              {
                name: "Fatima Rahman",
                role: "Freelance Designer",
                quote:
                  "I sketch UI ideas in Notesify before jumping into Figma. Love the clarity.",
              },
              {
                name: "Liam Thompson",
                role: "Remote Team Lead",
                quote:
                  "We’ve ditched our internal wiki for Notesify. It’s faster and more human.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="min-w-[300px] max-w-[300px] bg-card border rounded-2xl shadow-sm p-6 text-left"
              >
                <p className="text-muted-foreground mb-4">
                  “{testimonial.quote}”
                </p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
