import Layout from "../components/layout/Layout";

export function ForgotPasswordPage() {
  return (
    <Layout>
      <h1>نسيت كلمة المرور</h1>
      <p>أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.</p>
      <form action="#" method="post">
        <div>
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <button type="submit">إرسال الرابط</button>
      </form>
    </Layout>
  );
}