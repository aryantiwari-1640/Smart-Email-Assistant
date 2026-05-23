import { useState } from 'react'
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert, Paper, Select, FormControl, InputLabel, MenuItem } from '@mui/material'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError('Please enter email content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/email/generate', {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data==='string' ? response.data :JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to generate reply. Is the backend running on http://localhost:8080?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Original Email Content"
          placeholder="Paste the email you want to reply to..."
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!emailContent || loading}
          >
            {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            {loading ? 'Generating...' : 'Generate Reply'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {generatedReply && (
         <Box sx={{mt:3}}>
              <Typography variant='h6' gutterBottom>
                  Generated Reply:
              </Typography>
              <TextField 
                  fullWidth
                  multiline
                  rows={6}
                  variant='outlined'
                  value={generatedReply || ''}
                  inputProps={{readOnly:true}}/>
          <Button
            variant='outlined'
            sx={{mt:2}}
            onClick={()=> navigator.clipboard.writeText(generatedReply)}>
              Copy To Clipboard
          </Button>
         </Box>
        )}
      </Box>
    </Container>
  )
}

export default App
