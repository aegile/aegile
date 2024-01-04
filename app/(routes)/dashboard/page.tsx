import { getCookie, getCookies, hasCookie } from 'cookies-next';
import { cookies } from 'next/headers';

const Home = async () => {
  // It's not possible to update the cookie in RSC

  console.log(getCookie('accessToken', { cookies }));
  console.log(getCookies({ cookies }));
  console.log(hasCookie('accessToken', { cookies }));

  return (
    <main>
      <h1>Hello cookies next</h1>
    </main>
  );
};

export default Home;
