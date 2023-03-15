import axios from 'axios';

const LandingPage = ({currentUser}) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>
}

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    // requests should be made to http://ingress-nginx.ingress-nginx
    const {data} = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
      headers: req.headers
    });
    return data;
    return {}
  } else {
    // we are in the browser
    const {data} = await axios.get('/api/users/currentuser');
    return data;
  }

  return {};
};

export default LandingPage;
