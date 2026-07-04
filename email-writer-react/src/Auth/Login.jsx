import { Box, Paper, Typography, Stack } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { useAuth } from './AuthContext'

function Login() {
  const { login } = useAuth()

  const handleSuccess = async (credentialResponse) => {
    const googleIdToken = credentialResponse.credential

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: googleIdToken }),
    })

    if (!response.ok) {
      console.error('Login failed')
      return
    }

    const { jwt, email } = await response.json()
    login(jwt, email)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 4,
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px -20px rgba(0,0,0,0.4)',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
            mx: 'auto',
            mb: 2,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Smart Reply Assistant
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
          Sign in to start generating email replies
        </Typography>

        <Stack alignItems="center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.error('Google login failed')}
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
          />
        </Stack>
      </Paper>
    </Box>
  )
}

export default Login