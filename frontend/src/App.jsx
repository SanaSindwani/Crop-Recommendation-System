import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Navbar() {
    return (
        <nav style={styles.navbar}>
            <div style={styles.navTitle}>🌿 AgroBuddy</div>
            <div style={styles.navLinks}>
                <a href="#" style={styles.navLink}>Home</a>
                <a href="#" style={styles.navLink}>Predict</a>
                <a href="#" style={styles.navLink}>About</a>
            </div>
        </nav>
    );
}

const styles = {
    app: {
        backgroundColor: '#f0fdf4',
        minHeight: '100vh',
        width: '100vw',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box'
    },
    navbar: {
        width: '95%',
        background: '#bdecd2',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px'
    },
    navTitle: {
        fontSize: '1.5rem',
        color: '#0b3d2e',
        fontWeight: 'bold'
    },
    navLinks: {
        display: 'flex',
        gap: '15px'
    },
    navLink: {
        color: '#0b3d2e',
        textDecoration: 'none',
        fontWeight: '500'
    },
    card: (isMobile) => ({
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        margin: '30px auto',
        width: isMobile ? '90%' : '50%',
        maxWidth: '800px',
        textAlign: 'center',
        transition: 'width 0.3s ease-in-out'
    }),
    input: {
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    },
    button: {
        background: '#88ccaa',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '15px'
    },
    result: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#d4edda',
        borderRadius: '5px',
        border: '1px solid #c3e6cb'
    },
    error: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8d7da',
        borderRadius: '5px',
        border: '1px solid #f5c6cb'
    }
};

function App() {
    const [formData, setFormData] = useState({
        Temperature: '', Humidity: '', Rainfall: '', PH: '',
        Nitrogen: '', Phosphorous: '', Potassium: '', Carbon: '',
        Soil: 'Loamy Soil'
    });
    const [prediction, setPrediction] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); setPrediction(''); setError('');
        try {
            const payload = Object.fromEntries(
                Object.entries(formData).map(([k,v]) => [k, k !== 'Soil' ? parseFloat(v) : v])
            );
            const res = await axios.post('http://localhost:5000/predict', payload);
            setPrediction(res.data.predicted_crop);
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.error || 'Prediction Failed!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.app}>
            <Navbar />
            <div style={styles.card(isMobile)}>
                <h2 style={{ color: '#0b3d2e' }}>Crop Recommendation System 🌾</h2>
                <form onSubmit={handleSubmit}>
                    {['Temperature','Humidity','Rainfall','PH','Nitrogen','Phosphorous','Potassium','Carbon'].map(name => (
                        <input
                            key={name}
                            style={styles.input}
                            type="number"
                            step="any"
                            name={name}
                            placeholder={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required
                        />
                    ))}
                    <select style={styles.select} name="Soil" value={formData.Soil} onChange={handleChange} required>
                        {['Acidic Soil','Peaty Soil','Neutral Soil','Loamy Soil','Alkaline Soil'].map(soil => (
                            <option key={soil} value={soil}>{soil}</option>
                        ))}
                    </select>
                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Predicting...' : 'Predict Crop'}
                    </button>
                </form>
                {prediction && (
                    <div style={styles.result}><h3>Recommended Crop: <strong>{prediction}</strong></h3></div>
                )}
                {error && (
                    <div style={styles.error}><h3>Error: <strong>{error}</strong></h3></div>
                )}
            </div>
        </div>
    );
}

export default App;
