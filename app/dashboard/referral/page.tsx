"use client";

import ReferralTab from "../../../components/Dashboard/ReferralTab";
import { useUser } from "../layout";
import AuthGuard from "../../../components/AuthGuard";

export default function ReferralPage() {
    const { userDetails } = useUser();
    return (
        <AuthGuard>
            <ReferralTab
                userReferral={{
                    userId: userDetails.userId,
                    referralUsed: userDetails.referralUsed,
                    referralCount: userDetails.referralCount,
                }}
            />
        </AuthGuard>
    );
}
