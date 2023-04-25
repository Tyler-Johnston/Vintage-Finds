import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function LoginTitle() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      console.log(user);
      router.push('/');
    });
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          <Link href="/signup">Create account</Link>
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="example@vintagefinds.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Group position="apart" mt="lg">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <Anchor component="button" size="sm">
              <Link href="/forgotpassword">Forgot password?</Link>
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
