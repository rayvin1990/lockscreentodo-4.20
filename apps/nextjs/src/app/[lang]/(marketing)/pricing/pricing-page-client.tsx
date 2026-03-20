"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PricingCards } from "~/components/price/pricing-cards";
import { PricingFaq } from "~/components/price/pricing-faq";
import { trpc } from "~/trpc/client";

interface PricingPageClientProps {
  dict: any;
  lang: string;
}

export function PricingPageClient({ dict, lang }: PricingPageClientProps) {
  const { user, isLoaded } = useUser();
  const [subscriptionPlan, setSubscriptionPlan] = useState<any>(undefined);

  useEffect(() => {
    async function loadSubscription() {
      if (user?.id) {
        try {
          const plans = await trpc.stripe.userPlans.query();
          setSubscriptionPlan(plans);
        } catch (error) {
          console.error("Error loading subscription data:", error);
        }
      }
    }

    loadSubscription();
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="flex w-full flex-col gap-16 py-8 md:py-8">
        <div className="container text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards
        userId={user?.id}
        subscriptionPlan={subscriptionPlan}
        dict={dict.price}
        params={{ lang }}
      />
      <hr className="container" />
      <PricingFaq params={{ lang }} dict={dict.price} />
    </div>
  );
}
