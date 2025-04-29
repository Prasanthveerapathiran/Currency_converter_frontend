import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface RatesResponse {
  response: {
    rates: {
      [key: string]: number;
    };
    base: string;
  };
}

const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'];

function AllCurrencies() {
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('INR');

  const fetchRates = (base: string) => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:8888/api/currency/latest?base=${base}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch currencies');
        }
        return res.json();
      })
      .then((data: RatesResponse) => {
        setRates(data.response.rates || {});
        setBaseCurrency(data.response.base);
      })
      .catch(() => setError('Error loading exchange rates'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRates(baseCurrency);
  }, [baseCurrency]);

  const handleCurrencyChange = (event: any) => {
    setBaseCurrency(event.target.value);
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 32 }}>
      <Typography variant="h5" gutterBottom>
        All Currency Rates (Base: {baseCurrency})
      </Typography>

      <FormControl fullWidth style={{ marginBottom: 20 }}>
        <InputLabel id="base-currency-label">Base Currency</InputLabel>
        <Select
          labelId="base-currency-label"
          value={baseCurrency}
          label="Base Currency"
          onChange={handleCurrencyChange}
        >
          {currencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <List>
          {Object.entries(rates).map(([code, value]) => (
            <ListItem key={code}>
              <ListItemText primary={`${code}: ${value.toFixed(4)}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default AllCurrencies;
