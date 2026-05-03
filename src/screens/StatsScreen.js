import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, ZONE_COLORS, ZONE_LABELS } from '../theme';
import { Card, Lbl, Chip, MiniBar } from '../ui';
import { STATS_MONTHLY, GARMIN_MONTHLY } from '../sampleData';

const PERF_VIEWS = [
  { id: 'volume', l: 'Volume kg' },
  { id: 'sessions', l: 'Séances' },
  { id: 'prs', l: 'PR' },
];
const GARMIN_VIEWS = [
  { id: 'calories', l: 'Calories' },
  { id: 'zones', l: 'Zones' },
  { id: 'fc', l: 'FC moy.' },
];
const TOP_COACHES = [
  { n: 'Romain', s: 24 },
  { n: 'Alex', s: 18 },
  { n: 'Julie', s: 11 },
  { n: 'Maria', s: 7 },
];

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [section, setSection] = useState('perfs');
  const [view, setView] = useState('volume');
  const [garminView, setGarminView] = useState('calories');

  const totalKg = STATS_MONTHLY.reduce((s, m) => s + m.kg, 0);
  const totalSessions = STATS_MONTHLY.reduce((s, m) => s + m.sessions, 0);
  const totalPRs = STATS_MONTHLY.reduce((s, m) => s + m.prs, 0);
  const totalCal = GARMIN_MONTHLY.reduce((s, m) => s + m.cal, 0);
  const avgZ2 = Math.round(GARMIN_MONTHLY.reduce((s, m) => s + m.z2, 0) / GARMIN_MONTHLY.length);
  const avgZ3 = Math.round(GARMIN_MONTHLY.reduce((s, m) => s + m.z3, 0) / GARMIN_MONTHLY.length);

  const bigStat = view === 'volume'
    ? `${(totalKg / 1000).toFixed(1)}T`
    : view === 'sessions' ? `${totalSessions}` : `${totalPRs}`;
  const subStat = view === 'volume'
    ? `~${(totalKg / 7000).toFixed(1)}T / mois`
    : view === 'sessions' ? `~${(totalSessions / 7).toFixed(1)} / mois` : `~${(totalPRs / 7).toFixed(1)} / mois`;
  const thisMonth = view === 'volume' ? '6.8T' : view === 'sessions' ? '14' : '3';
  const viewLabel = view === 'volume' ? 'VOLUME TOTAL (7 MOIS)' : view === 'sessions' ? 'SÉANCES TOTALES' : 'PR TOTAUX';

  return (
    <View style={{ flex: 1, backgroundColor: T.bg0 }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22, paddingBottom: 10 }}>
        <Lbl>STATISTIQUES</Lbl>
        <Text style={styles.screenTitle}>Mes Stats</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
          <Chip label="Perfs" active={section === 'perfs'} onPress={() => setSection('perfs')} />
          <Chip label="Garmin ❤️" active={section === 'garmin'} onPress={() => setSection('garmin')} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, gap: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {section === 'perfs' && (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {PERF_VIEWS.map(v => (
                <Chip key={v.id} label={v.l} active={view === v.id} onPress={() => setView(v.id)} />
              ))}
            </View>

            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View>
                  <Lbl>{viewLabel}</Lbl>
                  <Text style={styles.bigStat}>{bigStat}</Text>
                  <Text style={styles.subStat}>{subStat}</Text>
                </View>
                <View style={styles.thisMonthBox}>
                  <Lbl>CE MOIS</Lbl>
                  <Text style={styles.thisMonthVal}>{thisMonth}</Text>
                </View>
              </View>
              <MiniBar
                data={STATS_MONTHLY.map(m => ({
                  v: view === 'volume' ? m.kg : view === 'sessions' ? m.sessions : m.prs,
                  l: m.m.slice(0, 3),
                }))}
                height={80}
              />
            </Card>

            <Card>
              <Lbl style={{ marginBottom: 12 }}>RÉPARTITION BOX / DROP-IN</Lbl>
              {[
                { l: 'Ma box', v: 72, c: T.accentColor },
                { l: 'Drop-in', v: 28, c: T.dropColor },
              ].map(b => (
                <View key={b.l} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'DMSans_400Regular', color: T.textSecondary }}>{b.l}</Text>
                    <Text style={{ fontSize: 15, fontFamily: 'DMSans_700Bold', color: b.c }}>{b.v}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${b.v}%`, backgroundColor: b.c }]} />
                  </View>
                </View>
              ))}
            </Card>

            <Card>
              <Lbl style={{ marginBottom: 12 }}>TOP COACHS</Lbl>
              {TOP_COACHES.map((c, i) => (
                <View key={i} style={styles.coachRow}>
                  <View style={styles.coachRank}>
                    <Text style={{ fontSize: 11, fontFamily: 'DMMono_400Regular', color: T.textMuted }}>{i + 1}</Text>
                  </View>
                  <Text style={styles.coachName}>{c.n}</Text>
                  <Text style={styles.coachSessions}>{c.s} séances</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {section === 'garmin' && (
          <>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={[styles.garminSummary, { flex: 1 }]}>
                <Lbl>CALORIES TOTALES</Lbl>
                <Text style={styles.garminSummaryVal}>
                  {(totalCal / 1000).toFixed(1)}<Text style={{ fontSize: 14, color: T.textMuted }}>k</Text>
                </Text>
                <Text style={styles.garminSummaryUnit}>kcal sur 7 mois</Text>
              </View>
              <View style={[styles.garminSummary, { flex: 1 }]}>
                <Lbl>ZONE 2 MOY.</Lbl>
                <Text style={[styles.garminSummaryVal, { color: '#4abf7a' }]}>
                  {avgZ2}<Text style={{ fontSize: 14, color: T.textMuted }}>%</Text>
                </Text>
                <Text style={styles.garminSummaryUnit}>endurance de base</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 6 }}>
              {GARMIN_VIEWS.map(v => (
                <Chip key={v.id} label={v.l} active={garminView === v.id} onPress={() => setGarminView(v.id)} />
              ))}
            </View>

            {garminView === 'calories' && (
              <Card>
                <Lbl style={{ marginBottom: 4 }}>CALORIES / MOIS</Lbl>
                <Text style={styles.chartSubtitle}>
                  Avr : <Text style={{ color: T.accentColor, fontFamily: 'DMSans_700Bold' }}>6 100 kcal</Text> · record
                </Text>
                <MiniBar
                  data={GARMIN_MONTHLY.map(m => ({ v: m.cal, l: m.m.slice(0, 3) }))}
                  height={80}
                  barColor={T.accentColor}
                />
              </Card>
            )}

            {garminView === 'zones' && (
              <Card>
                <Lbl style={{ marginBottom: 12 }}>RÉPARTITION ZONES / MOIS</Lbl>
                <View style={{ gap: 8 }}>
                  {GARMIN_MONTHLY.map((m, i) => {
                    const z1 = Math.max(0, 100 - m.z2 - m.z3 - m.z4 - m.z5);
                    return (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.zoneMonth}>{m.m.slice(0, 3)}</Text>
                        <View style={{ flex: 1, height: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' }}>
                          {[z1, m.z2, m.z3, m.z4, m.z5].map((v, j) => v > 0 ? (
                            <View key={j} style={{ flex: v, backgroundColor: ZONE_COLORS[j] }} />
                          ) : null)}
                        </View>
                        <Text style={styles.zoneZ2}>Z2 {m.z2}%</Text>
                      </View>
                    );
                  })}
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  {ZONE_LABELS.map((z, i) => (
                    <View key={z} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ZONE_COLORS[i] }} />
                      <Text style={{ fontSize: 10, fontFamily: 'DMMono_400Regular', color: T.textMuted }}>{z}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {garminView === 'fc' && (
              <Card>
                <Lbl style={{ marginBottom: 4 }}>FC MOYENNE / MOIS</Lbl>
                <Text style={styles.chartSubtitle}>
                  Avr : <Text style={{ color: '#e03050', fontFamily: 'DMSans_700Bold' }}>163 bpm</Text>
                </Text>
                <MiniBar
                  data={GARMIN_MONTHLY.map(m => ({ v: m.fcAvg, l: m.m.slice(0, 3) }))}
                  height={80}
                  barColor="#e03050"
                />
              </Card>
            )}

            <Card>
              <Lbl style={{ marginBottom: 10 }}>ZONE 2 — TENDANCE</Lbl>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View>
                  <Text style={{ fontSize: 13, fontFamily: 'DMSans_400Regular', color: T.textSecondary }}>Moy. Z2+Z3 sur 7 mois</Text>
                  <Text style={{ fontSize: 28, fontFamily: 'DMSans_700Bold', color: '#4abf7a' }}>
                    {avgZ2 + avgZ3}<Text style={{ fontSize: 14, color: T.textMuted }}>%</Text>
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 11, fontFamily: 'DMMono_400Regular', color: T.textMuted }}>OBJECTIF</Text>
                  <Text style={{ fontSize: 18, fontFamily: 'DMSans_700Bold', color: T.textSecondary }}>60%</Text>
                </View>
              </View>
              <View style={styles.z2Track}>
                <View style={[styles.z2Fill, { width: `${avgZ2 + avgZ3}%` }]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 10, fontFamily: 'DMMono_400Regular', color: '#4abf7a' }}>{avgZ2 + avgZ3}% atteint</Text>
                <Text style={{ fontSize: 10, fontFamily: 'DMMono_400Regular', color: T.textMuted }}>objectif 60%</Text>
              </View>
            </Card>
          </>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    lineHeight: 32,
    marginTop: 4,
  },
  bigStat: {
    fontSize: 44,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
    lineHeight: 52,
    marginTop: 6,
  },
  subStat: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
    marginTop: 4,
  },
  thisMonthBox: {
    backgroundColor: T.bg3,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  thisMonthVal: {
    fontSize: 22,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    marginTop: 4,
  },
  barTrack: {
    height: 6,
    backgroundColor: T.bg3,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  coachRank: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
    color: T.textPrimary,
  },
  coachSessions: {
    fontSize: 12,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
  },
  garminSummary: {
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 12,
    gap: 3,
  },
  garminSummaryVal: {
    fontSize: 26,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    lineHeight: 32,
    marginTop: 4,
  },
  garminSummaryUnit: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
  },
  chartSubtitle: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
    marginBottom: 12,
  },
  zoneMonth: {
    fontSize: 9,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
    width: 26,
  },
  zoneZ2: {
    fontSize: 9,
    fontFamily: 'DMMono_400Regular',
    color: '#4abf7a',
    width: 40,
    textAlign: 'right',
  },
  z2Track: {
    height: 8,
    backgroundColor: T.bg3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  z2Fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#4abf7a',
  },
});
