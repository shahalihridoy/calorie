import Loader from "@components/atoms/Loader";
import { useAppSelector } from "@hooks/reduxHooks";
import { AuthRoles } from "@shared/enums";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";

const withAuth = (Component: any, allowedUsers: AuthRoles[] = []) => {
  const ModifiedComponent = (props: any) => {
    const router = useRouter();
    const { user, loading } = useAppSelector((state) => state.auth);
    const hasAccess = user && allowedUsers.includes(user?.role);
    const Layout = Component.Layout || Fragment;

    useEffect(() => {
      if (!hasAccess && !loading) {
        router.push("/access-denied");
      }
    }, [hasAccess, loading, router]);

    return !loading && user && hasAccess ? (
      <Layout>
        <Component {...props} />
      </Layout>
    ) : (
      <Loader logo />
    );
  };

  return ModifiedComponent;
};

export default withAuth;
