import Layout from "../components/layout/Layout";

export function LoginPage() {
  return (
    <Layout>
      <h1>تسجيل الدخول</h1>
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
        <div>
          <label htmlFor="password">كلمة المرور</label>
          <input
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <button type="submit">تسجيل الدخول</button>
      </form>
    </Layout>
  );
}