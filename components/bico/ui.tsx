import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PropsWithChildren, ReactNode } from 'react';
import {
  ColorValue,
  Image,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { BicoTokens, withAlpha } from '@/constants/bico-theme';
import { useBico } from '@/context/bico-context';

const tucoImage = require('@/assets/images/bico_logo.png');

type IconName = keyof typeof Ionicons.glyphMap;

export function BicoTopBar({
  title,
  subtitle,
  leading,
  trailing,
  large = false,
}: {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  large?: boolean;
}) {
  const { tokens } = useBico();

  return (
    <View style={[styles.topBar, { backgroundColor: tokens.bg, paddingHorizontal: large ? 20 : 16 }]}>
      {leading ? (
        <>
          {leading}
          <View style={{ width: 12 }} />
        </>
      ) : null}
      <View style={styles.topBarTitleWrap}>
        <Text
          numberOfLines={1}
          style={[
            styles.topBarTitle,
            {
              color: tokens.text,
              fontSize: large ? 24 : 17,
              fontWeight: large ? '700' : '600',
            },
          ]}>
          {title}
        </Text>
        {subtitle ? <Text style={[styles.topBarSubtitle, { color: tokens.textMuted }]}>{subtitle}</Text> : null}
      </View>
      {trailing ? (
        <>
          <View style={{ width: 12 }} />
          {trailing}
        </>
      ) : null}
    </View>
  );
}

export function IconButton({
  name,
  onPress,
  color,
  size = 22,
  style,
}: {
  name: IconName;
  onPress?: PressableProps['onPress'];
  color?: ColorValue;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { tokens } = useBico();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, style, pressed && styles.pressed]}>
      <Ionicons name={name} size={size} color={color ?? tokens.text} />
    </Pressable>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ai' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

function buttonColors(variant: ButtonVariant, tokens: BicoTokens) {
  switch (variant) {
    case 'secondary':
      return { backgroundColor: tokens.bg, color: tokens.text, borderColor: tokens.border };
    case 'ghost':
      return { backgroundColor: 'transparent', color: tokens.text, borderColor: 'transparent' };
    case 'ai':
      return { backgroundColor: tokens.orange, color: '#FFFFFF', borderColor: 'transparent' };
    case 'danger':
      return { backgroundColor: tokens.bg, color: tokens.red, borderColor: tokens.border };
    default:
      return { backgroundColor: tokens.green, color: '#FFFFFF', borderColor: 'transparent' };
  }
}

export function BicoButton({
  label,
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  onPress,
  iconLeft,
  iconRight,
  style,
  textStyle,
}: {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  onPress?: PressableProps['onPress'];
  iconLeft?: IconName;
  iconRight?: IconName;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  const { tokens } = useBico();
  const colors = buttonColors(variant, tokens);
  const metrics = {
    sm: { height: 32, paddingHorizontal: 12, fontSize: 13, iconSize: 16 },
    md: { height: 44, paddingHorizontal: 16, fontSize: 15, iconSize: 18 },
    lg: { height: 52, paddingHorizontal: 20, fontSize: 16, iconSize: 18 },
  }[size];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: metrics.height,
          paddingHorizontal: metrics.paddingHorizontal,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          alignSelf: full ? 'stretch' : 'flex-start',
        },
        full && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}>
      {children ?? (
        <View style={styles.buttonContent}>
          {iconLeft ? <Ionicons name={iconLeft} size={metrics.iconSize} color={colors.color} /> : null}
          {label ? (
            <Text style={[styles.buttonText, { color: colors.color, fontSize: metrics.fontSize }, textStyle]}>
              {label}
            </Text>
          ) : null}
          {iconRight ? <Ionicons name={iconRight} size={metrics.iconSize} color={colors.color} /> : null}
        </View>
      )}
    </Pressable>
  );
}

export function BicoField({
  label,
  placeholder,
  secureTextEntry,
  icon,
  trailing,
  error,
  hint,
  style,
  ...inputProps
}: TextInputProps & {
  label?: string;
  icon?: IconName;
  trailing?: ReactNode;
  error?: string;
  hint?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { tokens } = useBico();

  return (
    <View style={style}>
      {label ? <Text style={[styles.fieldLabel, { color: tokens.text }]}>{label}</Text> : null}
      <View
        style={[
          styles.fieldShell,
          {
            backgroundColor: tokens.bgSoft,
            borderColor: error ? tokens.red : tokens.border,
          },
        ]}>
        {icon ? <Ionicons name={icon} size={18} color={tokens.textMuted} /> : null}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={tokens.textMuted}
          secureTextEntry={secureTextEntry}
          style={[styles.textInput, { color: tokens.text }]}
          {...inputProps}
        />
        {trailing}
      </View>
      {hint && !error ? <Text style={[styles.fieldHelp, { color: tokens.textMuted }]}>{hint}</Text> : null}
      {error ? <Text style={[styles.fieldHelp, { color: tokens.red }]}>{error}</Text> : null}
    </View>
  );
}

export function BicoCard({
  children,
  style,
  contentStyle,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>) {
  const { isDark, cardStyle, tokens } = useBico();
  const cardStyles: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor: cardStyle === 'flat' ? tokens.bgSoft : tokens.bg,
      borderColor: cardStyle === 'flat' ? 'transparent' : cardStyle === 'outlined' ? tokens.border : tokens.borderSoft,
      shadowOpacity: !isDark && cardStyle === 'soft' ? 0.04 : 0,
    },
    style,
  ];

  return <View style={cardStyles}><View style={contentStyle}>{children}</View></View>;
}

export function BicoAvatar({ name, size = 36, color }: { name: string; size?: number; color?: string }) {
  const { tokens } = useBico();
  const palette = [tokens.green, tokens.purple, tokens.orange, '#0EA5E9', '#EC4899', '#8B5CF6'];
  let hash = 0;
  for (const char of name) {
    hash = ((hash * 31) + char.charCodeAt(0)) & 0x7fffffff;
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: color ?? palette[hash % palette.length] }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

export function BicoPill({
  text,
  color = 'green',
  size = 'md',
  soft = true,
}: {
  text: string;
  color?: 'green' | 'purple' | 'orange' | 'red' | 'gray';
  size?: 'sm' | 'md';
  soft?: boolean;
}) {
  const { tokens } = useBico();
  const map = {
    green: { fg: tokens.green, bg: tokens.greenSoft },
    purple: { fg: tokens.purple, bg: tokens.purpleSoft },
    orange: { fg: tokens.orange, bg: tokens.orangeSoft },
    red: { fg: tokens.red, bg: tokens.redSoft },
    gray: { fg: tokens.textMuted, bg: tokens.borderSoft },
  }[color];
  const small = size === 'sm';

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: soft ? map.bg : map.fg,
          paddingHorizontal: small ? 7 : 9,
          paddingVertical: small ? 2 : 3,
        },
      ]}>
      <Text style={[styles.pillText, { color: soft ? map.fg : '#FFFFFF', fontSize: small ? 11 : 12 }]}>{text}</Text>
    </View>
  );
}

export function BicoToggle({ on, onPress }: { on: boolean; onPress?: () => void }) {
  const { tokens } = useBico();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggle, { backgroundColor: on ? tokens.green : tokens.border }]}>
      <View style={[styles.toggleKnob, { alignSelf: on ? 'flex-end' : 'flex-start' }]} />
    </Pressable>
  );
}

export function AISparkle({ size = 14 }: { size?: number }) {
  const { tokens } = useBico();

  return (
    <View style={[styles.aiSparkle, { width: size + 6, height: size + 6, backgroundColor: tokens.orangeSoft }]}>
      <MaterialIcons name="auto-awesome" size={Math.max(size - 2, 10)} color={tokens.orange} />
    </View>
  );
}

export function TucoSlot({ size = 96, mode }: { size?: number; mode?: 'placeholder' | 'simple' | 'hidden' }) {
  const { tucoMode } = useBico();
  const effectiveMode = mode ?? tucoMode;

  if (effectiveMode === 'hidden') {
    return null;
  }

  return (
    <Image
      source={tucoImage}
      resizeMode="contain"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
}

export function SocialIcon({ provider }: { provider: 'google' | 'facebook' }) {
  if (provider === 'google') {
    return <FontAwesome name="google" size={18} color="#4285F4" />;
  }

  return <FontAwesome name="facebook" size={20} color="#1877F2" />;
}

export function SectionTitle({ children }: PropsWithChildren) {
  const { tokens } = useBico();

  return <Text style={[styles.sectionTitle, { color: tokens.text }]}>{children}</Text>;
}

export function mutedText(tokens: BicoTokens): TextStyle {
  return {
    color: tokens.textMuted,
    fontSize: 13,
  };
}

export function softTint(color: string) {
  return withAlpha(color, 0.12);
}

const styles = StyleSheet.create({
  topBar: {
    minHeight: 56,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitleWrap: {
    flex: 1,
  },
  topBarTitle: {
    lineHeight: 29,
  },
  topBarSubtitle: {
    fontSize: 13,
    marginTop: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.72,
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  buttonContent: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  fieldShell: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    fontSize: 16,
    paddingVertical: 0,
  },
  fieldHelp: {
    fontSize: 12,
    marginTop: 5,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    shadowColor: '#0F172A',
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  avatar: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pill: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontWeight: '600',
  },
  toggle: {
    width: 36,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  aiSparkle: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tucoPlaceholder: {
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tucoPlaceholderText: {
    fontFamily: 'monospace',
    lineHeight: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
});
