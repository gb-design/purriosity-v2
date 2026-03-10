import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'motion/react';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const revealStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
    },
  },
};

export const revealItemSoft: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: easeOut,
    },
  },
};

type RevealSectionProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  once?: boolean;
  amount?: number;
};

export function RevealSection({
  children,
  once = true,
  amount = 0.2,
  ...props
}: RevealSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '0px 0px -90px 0px' }}
      variants={revealStagger}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  soft?: boolean;
};

export function RevealItem({ children, soft = false, variants, ...props }: RevealItemProps) {
  return (
    <motion.div variants={variants ?? (soft ? revealItemSoft : revealItem)} {...props}>
      {children}
    </motion.div>
  );
}
