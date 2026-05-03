import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { T, ZONE_COLORS, ZONE_LABELS } from './theme';

const { width: SCREEN_W } = Dimensions.get('window');

export function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function Lbl({ children, style }) {
  return (
    <Text style={[styles.lbl, style]}>{children}</Text>
  );
}

export function Chip({ label, active, onPress, color }) {
  const ac = color || T.accentColor;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: active ? ac : T.bg3,
          backgroundColor: active ? ac : 'transparent',
        },
      ]}
    >
      <Text style={[
        styles.chipText,
        { color: active ? (color ? '#fff' : T.bg0) : T.textSecondary, fontWeight: active ? '600' : '400' },
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function MiniBar({ data, barColor, height = 64 }) {
  const max = Math.max(...data.map(d => d.v), 1);
  const bc = barColor || T.accentColor;
  const barHeight = height - 18;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height }}>
      {data.map((d, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
          <View style={{
            width: '100%',
            borderRadius: 3,
            backgroundColor: i === data.length - 1 ? bc : T.bg3,
            height: Math.max(4, (d.v / max) * barHeight),
          }} />
          <Text style={{ fontSize: 9, fontFamily: 'DMMono_400Regular', color: T.textMuted }}>{d.l}</Text>
        </View>
      ))}
    </View>
  );
}

export function ZoneBar({ z2, z3, z4, z5 }) {
  const z1 = Math.max(0, 100 - z2 - z3 - z4 - z5);
  const zones = [z1, z2, z3, z4, z5];
  return (
    <View style={{ gap: 6 }}>
      <View style={{ height: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' }}>
        {zones.map((v, i) => v > 0 ? (
          <View key={i} style={{ flex: v, backgroundColor: ZONE_COLORS[i] }} />
        ) : null)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {zones.map((v, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, opacity: v === 0 ? 0.3 : 1 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ZONE_COLORS[i] }} />
            <Text style={{
              fontSize: 10, fontFamily: 'DMMono_400Regular',
              color: i === 1 || i === 2 ? ZONE_COLORS[i] : T.textMuted,
            }}>
              {ZONE_LABELS[i]} {v}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function GarminCard({ cal, fcMax, z2, z3, z4, z5 }) {
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Text style={{ fontSize: 14, color: T.accentColor }}>⚡</Text>
        <Lbl style={{ color: T.accentColor }}>DONNÉES GARMIN</Lbl>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <View style={styles.garminStat}>
          <Lbl>CALORIES</Lbl>
          <Text style={[styles.garminValue, { color: T.textPrimary }]}>{cal}</Text>
          <Text style={styles.garminUnit}>kcal</Text>
        </View>
        <View style={styles.garminStat}>
          <Lbl>FC MAX</Lbl>
          <Text style={[styles.garminValue, { color: '#e03050' }]}>{fcMax}</Text>
          <Text style={styles.garminUnit}>bpm</Text>
        </View>
        <View style={styles.garminStat}>
          <Lbl>Z2+Z3</Lbl>
          <Text style={[styles.garminValue, { color: '#4abf7a' }]}>
            {z2 + z3}<Text style={{ fontSize: 13, fontWeight: '400' }}>%</Text>
          </Text>
          <Text style={styles.garminUnit}>aérobie</Text>
        </View>
      </View>
      <Lbl style={{ marginBottom: 8 }}>RÉPARTITION ZONES</Lbl>
      <ZoneBar z2={z2} z3={z3} z4={z4} z5={z5} />
    </Card>
  );
}

export function SectionHeader({ title, subtitle, rightComponent }) {
  return (
    <View style={{ paddingHorizontal: 22, paddingBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Lbl>{subtitle}</Lbl>
          <Text style={styles.screenTitle}>{title}</Text>
        </View>
        {rightComponent}
      </View>
    </View>
  );
}

export function DropInBadge() {
  return (
    <View style={styles.dropBadge}>
      <Text style={styles.dropBadgeText}>✈ DROP-IN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 14,
  },
  lbl: {
    fontSize: 10,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
  },
  garminStat: {
    flex: 1,
    backgroundColor: T.bg3,
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  garminValue: {
    fontSize: 22,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 26,
  },
  garminUnit: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    lineHeight: 32,
    marginTop: 4,
  },
  dropBadge: {
    backgroundColor: 'rgba(240,160,80,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(240,160,80,0.25)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dropBadgeText: {
    color: T.dropColor,
    fontSize: 11,
    fontFamily: 'DMMono_400Regular',
  },
});
