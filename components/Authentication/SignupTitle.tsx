import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  TextInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Box,
  Progress,
  PasswordInput,
  Group,
  Center,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function SignupTitle() {
  const [email, setEmail] = useState('');
  const [value, setValue] = useInputState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, value)
      .then(({ user }) => {
        console.log(user);
        router.push('/');
      });
  };

  function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
      <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
        <Center inline>
          {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
          <Box ml={7}>{label}</Box>
        </Center>
      </Text>
    );
  }

  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
  ];

  function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;
    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
  }

  const strength = getStrength(value);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: '0ms' } }}
        value={
          value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));
  return (
    <form onSubmit={handleSubmit}>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Register Now
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{' '}
          <Anchor size="sm" component="button">
            <Link href="/login">Login</Link>
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="example@vintagefinds.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PasswordInput
            value={value}
            onChange={setValue}
            placeholder="Your password"
            label="Password"
            required
          />
          <Group spacing={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          <PasswordRequirement label="Has at least 6 characters" meets={value.length > 5} />
          {checks}
          <Button type="submit" fullWidth mt="xl">
            Sign up
          </Button>
        </Paper>
      </Container>
    </form>
  );
}
