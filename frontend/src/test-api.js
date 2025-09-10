// Simple test script to verify API connection
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test registration
    const registerResponse = await fetch('http://localhost:8000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'API Test User',
        email: 'apitest@example.com',
        password: 'apitest123'
      })
    });
    
    console.log('Registration response:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Registration data:', registerData);
    
    if (registerResponse.ok) {
      // Test login
      const loginResponse = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'apitest@example.com',
          password: 'apitest123'
        })
      });
      
      console.log('Login response:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login data:', loginData);
      
      if (loginResponse.ok) {
        // Test tasks
        const tasksResponse = await fetch('http://localhost:8000/tasks', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        console.log('Tasks response:', tasksResponse.status);
        const tasksData = await tasksResponse.json();
        console.log('Tasks data:', tasksData);
      }
    }
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
};

// Run the test
testAPI();
