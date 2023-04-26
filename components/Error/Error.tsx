import { createStyles, Title, Text, Button, Container, Group, rem } from '@mantine/core';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

type ErrorProps = {
  number: number;
  description: string;
};

export function ErrorTitle(props: ErrorProps) {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>{props.number}</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
        Unfortunately, this is only a {props.number} page. {props.description}
      </Text>
      <Group position="center">
        <Button variant="subtle" size="md" onClick={() => router.push('/')}>
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
