import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AllCurrencies from './AllCurrencies';
import './App.css';

const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'];

function CurrencyConverter() {
  const [source, setSource] = useState('AUD');
  const [target, setTarget] = useState('USD');
  const [amount, setAmount] = useState<number>(1000);
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const convertCurrency = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8888/api/currency/convert?source=${source}&target=${target}&amount=${amount}`
      );
      if (!response.ok) throw new Error('Conversion failed');
      const data = await response.json();
      setConverted(data);
    } catch (err) {
      setError('Conversion failed. Please check backend or network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 50 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Currency Converter
        </Typography>

        <Box display="flex" gap={2} alignItems="center" mb={3}>
          <Box flex={1}>
            <Typography variant="subtitle1">Amount</Typography>
            <TextField
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              inputProps={{ min: 0 }}
              variant="outlined"
            />
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle1">From</Typography>
            <TextField
              select
              fullWidth
              value={source}
              onChange={(e) => setSource(e.target.value)}
              variant="outlined"
            >
              {currencies.map((cur) => (
                <MenuItem key={cur} value={cur}>
                  {cur}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box flexShrink={0} fontSize={24} mt={3}>
            ⇄
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle1">Converted to</Typography>
            <TextField
              select
              fullWidth
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              variant="outlined"
            >
              {currencies.map((cur) => (
                <MenuItem key={cur} value={cur}>
                  {cur}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={convertCurrency}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Convert'}
        </Button>

        {converted !== null && (
          <Typography variant="h6" align="center" mt={3}>
            Converted Amount: {converted.toFixed(2)} {target}
          </Typography>
        )}

        {error && (
          <Alert severity="error" style={{ marginTop: 16 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/all')}
          style={{ marginTop: 24 }}
        >
          View All Currency Rates
        </Button>
      </Paper>
    </Container>
  );
}

// Main App Routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<CurrencyConverter />} />
      <Route path="/all" element={<AllCurrencies />} />
    </Routes>
  );
}

export default App;
