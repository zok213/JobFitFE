import ResetPassword from "../../../components/ResetPassword";

export default function ResetPasswordPage(props: {
  params: { token: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return <ResetPassword token={props.params.token} />;
} 