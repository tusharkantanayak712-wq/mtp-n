"use client";

import WalletTab from "../../../components/Dashboard/WalletTab";
import { useUser } from "../layout";
import AuthGuard from "../../../components/AuthGuard";

export default function WalletPage() {
    const { walletBalance, setWalletBalance, userDetails } = useUser();
    return (
        <AuthGuard>
            <WalletTab
                walletBalance={walletBalance}
                setWalletBalance={setWalletBalance}
                userReferral={{
                    userId: userDetails.userId,
                    userType: userDetails.userType,
                    referralUsed: userDetails.referralUsed,
                    referralCount: userDetails.referralCount,
                }}
            />
        </AuthGuard>
    );
}
