import Link from 'next/link';
import {
    TextInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
  } from '@mantine/core';
import { PasswordStrength } from './PasswordStrength';

  export function SignupTitle() {
    return (
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
          <TextInput label="Email" placeholder="example@vintagefinds.com" required />
          <PasswordStrength />
          <Button fullWidth mt="xl">
            Sign up
          </Button>
        </Paper>
      </Container>
    );
  }
