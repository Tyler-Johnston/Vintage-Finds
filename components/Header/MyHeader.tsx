import { createStyles, Header, Group, rem, Image, Text } from '@mantine/core';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: '#12263A',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: '#12263A',
      color: '#e1f0f7',
    },
  },
}));

interface HeaderProps {
  links: { link: string; label: string }[];
}

export function MyHeader({ links }: HeaderProps) {
  const { classes } = useStyles();
  const router = useRouter();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={58} className="headerBackground" mb={30}>
      <div className={classes.inner}>
        <Group onClick={() => router.push('/')} className={classes.link}>
          <Image radius="xs" src="/home.png" alt="Vintage Finds Logo" height={20} fit="contain" />
          <Text>Vintage Finds</Text>
        </Group>

        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {items}
          </Group>
        </Group>
      </div>
    </Header>
  );
}
