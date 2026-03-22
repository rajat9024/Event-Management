"use client";

import { SignInButton, useAuth, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { BarLoader } from 'react-spinners';
import { useStoreUser } from '@/hooks/use-store-user';
import { Authenticated, Unauthenticated } from 'convex/react';
import { Building, Crown, MessageSquare, Plus, Store, Ticket } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import OnboardingModal from "./onboarding-model";
import { useOnboarding } from "@/hooks/use-onboarding";
import SearchLocationBar from "./search-location-bar";
import { Badge } from './ui/badge';
import UpgradeModal from "./upgrade-model";
import { motion, useScroll, useTransform } from "framer-motion";

const Header = () => {
  const { isLoading } = useStoreUser();
  const { scrollY } = useScroll();

  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } =
    useOnboarding();

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const vendor = useQuery(api.vendors.getVendorByUserId);

  const [showUpgradeModal, setShowUpgradeModal] = useState();
  return (
    <>
      <motion.nav
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOgo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src="/spott.png" alt="spott Logo" width={500} height={500} className="w-full h-11" priority />
            </motion.div>

            {hasPro && (
              <Badge className="bg-linear-to-r from-pink-500 to-orange-500 gap-1 text-white ml-3">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
          </Link>
          {/* searchbar */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchLocationBar />
          </div>

          {/* right side actions */}
          <div className='flex items-center gap-2'>
            {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
                className="hover:bg-white/5 transition-all text-gray-400 hover:text-white"
              >
                Pricing
              </Button>
            )}

            <Button variant="ghost" size="sm" className="hidden lg:flex hover:bg-white/5 transition-all group px-4">
              <Link href="/explore" className="text-gray-400 group-hover:text-white">Explore</Link>
            </Button>

            <Button variant="ghost" size="sm" className="hover:bg-white/5 transition-all group px-4">
              <Link href="/marketplace" className="text-gray-400 group-hover:text-white">Marketplace</Link>
            </Button>

            <Authenticated>
              <Button size="sm" asChild className="relative mr-4 bg-white text-black hover:bg-white/90 font-bold px-6 transition-all active:scale-95 overflow-hidden group">
                <Link href="/create-event">
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className='w-4 h-4' />
                    <span className='hidden sm:inline'>Create Event</span>
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              </Button>

              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link label='My Tickets' labelIcon={<Ticket size={16} />}
                    href='/my-tickets'
                  />

                  <UserButton.Link label='My Events' labelIcon={<Building size={16} />}
                    href='/my-events'
                  />

                  <UserButton.Link
                    label={vendor ? 'Vendor Dashboard' : 'Become a Vendor'}
                    labelIcon={<Store size={16} />}
                    href={vendor ? '/vendor' : '/vendor/onboarding'}
                  />

                  <UserButton.Link label='Messages' labelIcon={<MessageSquare size={16} />}
                    href='/messages'
                  />

                  <UserButton.Action label='manageAccount' />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>


            <Unauthenticated>
              <SignInButton mode='modal'>
                <Button size="sm" className="mr-4">Sign In</Button>
              </SignInButton>
            </Unauthenticated>

          </div>

        </div>

        {/* mobile search locationn  */}
        <div className="md:hidden border-t px-3 py-3">
          <SearchLocationBar />
        </div>

        {/* Loader */}
        {isLoading && (
          <div className='absolut bottom-0 left-0 w-full'>
            <BarLoader width={"100%"} color="#a855f7" />
          </div>
        )}
      </motion.nav>

      {/* Models */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete} />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="header"
      />

    </>
  );
}

export default Header
