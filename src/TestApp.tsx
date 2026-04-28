function TestApp() {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Test Page</h1>
            <p>If you see this, React is working!</p>
            <button onClick={() => alert('Working!')}>Click Me</button>
        </div>
    );
}

export default TestApp;