
import { useEffect, useState } from 'react';

function App() {
  const [greeting, setGreeting] = useState();
  
  useEffect(() => {
     // If you are testing locally, rename to port 3000. Eg: fetch('http://127.0.0.1:3000/api/hello')
    fetch('http://127.0.0.1:8080/api/hello')
      .then(res => res.json())
      .then(greeting => setGreeting(greeting.message))
  }, [setGreeting]);
  
  return (
    <div>Greeting: {greeting}</div>
  );
} 

export default App;