import { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useAuth } from './Auth/AuthContext'
import Login from './Auth/Login'

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
]

function App() {
  const { token, email, logout } = useAuth()
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('professional')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Not logged in -> show the login screen, not the app
  if (!token) {
    return <Login />
  }

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError('Please enter email content')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedReply('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emailContent, tone }),
      })

      if (response.status === 401) {
        logout()
        return
      }

      if (response.status === 429) {
        const data = await response.json();
        setError(data.error || 'Too many requests — please wait a moment.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const text = await response.text()
      try {
        const data = JSON.parse(text)
        setGeneratedReply(typeof data === 'string' ? data : data.reply ?? JSON.stringify(data))
      } catch {
        setGeneratedReply(text)
      }
    } catch (err) {
      setError(err.message || 'Failed to generate reply. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0F172A 0%, #0F172A 220px, #F8FAFC 220px)',
      }}
    >
      <Container maxWidth="sm" sx={{ pt: 6, pb: 8 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.1 }}>
                Reply Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {email}
              </Typography>
            </Box>
          </Stack>

          <Tooltip title="Sign out">
            <IconButton size="small" onClick={logout} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Main card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: '0 20px 60px -20px rgba(15, 23, 42, 0.25)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5, fontWeight: 600, letterSpacing: 0.4 }}>
            ORIGINAL EMAIL
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Paste the email you're replying to..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: '#F8FAFC',
              },
            }}
          />

          <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1, fontWeight: 600, letterSpacing: 0.4 }}>
            TONE
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {TONES.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                onClick={() => setTone(t.value)}
                sx={{
                  fontWeight: 600,
                  px: 1,
                  borderRadius: '8px',
                  backgroundColor: tone === t.value ? '#0D9488' : '#F1F5F9',
                  color: tone === t.value ? '#fff' : '#475569',
                  '&:hover': {
                    backgroundColor: tone === t.value ? '#0F766E' : '#E2E8F0',
                  },
                }}
              />
            ))}
          </Stack>

          <Button
            fullWidth
            disableElevation
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            sx={{
              py: 1.4,
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #14B8A6, #0D9488)',
              color: '#fff',
              '&:hover': {
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0F9D8F, #0B7C72)',
              },
              '&.Mui-disabled': {
                color: '#fff',
                opacity: 0.6,
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={18} sx={{ color: '#fff', mr: 1.5 }} />
                Generating...
              </>
            ) : (
              'Generate reply'
            )}
          </Button>

          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Fade in={Boolean(generatedReply)} unmountOnExit>
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: 0.4 }}>
                  GENERATED REPLY
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                  <IconButton size="small" onClick={handleCopy} sx={{ color: '#0D9488' }}>
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply}
                inputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: '#F0FDFA',
                  },
                }}
              />
            </Box>
          </Fade>
        </Paper>
      </Container>
    </Box>
  )
}

export default App
