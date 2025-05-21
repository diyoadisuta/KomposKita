import Navbar from './Navbar';
import { auth } from '@/lib/auth';

export async function getServerSideProps({req}) {
  try {
    const session = await auth.api.getSession({
      headers: await req.headers,
    });

    return {
      props: {
        session: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        user: null,
      },
    };
  }
}

const Layout = ({ user, children }) => {
  return (
    <div>
      <Navbar user={user} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
