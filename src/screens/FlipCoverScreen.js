import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, ZONE_COLORS, ZONE_LABELS } from '../theme';
import { Lbl, ZoneBar } from '../ui';
import { useApp } from '../AppContext';
import { GARMIN_MONTHLY } from '../sampleData';

export default function FlipCoverScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { wods } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');

  const last = wods[0];
  const totalCal = GARMIN_MONTHLY.reduce((s, m) => s + m.cal, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeBtn}
      >
        <Text style={styles.closeBtnText}>✕ Fermer</Text>
      </TouchableOpacity>

      {/* Phone shell */}
      <View style={styles.phoneShell}>
        {/* Camera strip */}
        <View style={styles.cameraStrip}>
          <View style={styles.cameraDot} />
        </View>

        {/* Cover screen content */}
        <ScrollView
          contentContainerStyle={styles.coverContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Time */}
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.clock}>{hh}:{mm}</Text>
            <Text style={styles.clockDate}>Sam 3 Mai 2026</Text>
          </View>

          {/* Last session */}
          {last && (
            <View style={styles.lastSession}>
              <Lbl style={{ marginBottom: 6, color: T.textMuted }}>DERNIÈRE SÉANCE</Lbl>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={styles.lastSessionName}>{last.name}</Text>
                <Text style={styles.lastSessionResult}>{last.result}</Text>
              </View>
              <Text style={styles.lastSessionMeta}>{last.date} · {last.box}</Text>
              {last.garmin && (
                <View style={styles.garminRow}>
                  <View style={[styles.garminDot, { backgroundColor: '#e03050' }]} />
                  <Text style={styles.garminMini}>{last.garmin.fcMax} bpm</Text>
                  <View style={[styles.garminDot, { backgroundColor: T.accentColor }]} />
                  <Text style={styles.garminMini}>{last.garmin.cal} kcal</Text>
                  <View style={[styles.garminDot, { backgroundColor: '#4abf7a' }]} />
                  <Text style={[styles.garminMini, { color: '#4abf7a' }]}>Z2 {last.garmin.z2}%</Text>
                </View>
              )}
            </View>
          )}

          {/* Quick stats grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statTile}>
              <Lbl style={{ marginBottom: 3 }}>CE MOIS</Lbl>
              <Text style={styles.statVal}>14</Text>
              <Text style={styles.statUnit}>séances</Text>
            </View>
            <View style={styles.statTile}>
              <Lbl style={{ marginBottom: 3 }}>PR CE MOIS</Lbl>
              <Text style={styles.statVal}>3</Text>
              <Text style={styles.statUnit}>records</Text>
            </View>
            <View style={styles.statTile}>
              <Lbl style={{ marginBottom: 3 }}>CALORIES AVR.</Lbl>
              <Text style={[styles.statVal, { color: T.textPrimary }]}>6.1<Text style={styles.statUnit}>k</Text></Text>
              <Text style={styles.statUnit}>kcal</Text>
            </View>
            <View style={styles.statTile}>
              <Lbl style={{ marginBottom: 3 }}>ZONE 2 MOY.</Lbl>
              <Text style={[styles.statVal, { color: '#4abf7a' }]}>29<Text style={styles.statUnit}>%</Text></Text>
              <Text style={styles.statUnit}>aérobie</Text>
            </View>
          </View>

          {/* Zone bar */}
          <View style={styles.zoneBar}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Lbl>ZONES AVR.</Lbl>
              <Text style={{ fontSize: 10, fontFamily: 'DMMono_400Regular', color: '#4abf7a' }}>Z2+Z3 62%</Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, overflow: 'hidden', flexDirection: 'row', gap: 1 }}>
              <View style={{ flex: 6, backgroundColor: ZONE_COLORS[0] }} />
              <View style={{ flex: 29, backgroundColor: ZONE_COLORS[1] }} />
              <View style={{ flex: 33, backgroundColor: ZONE_COLORS[2] }} />
              <View style={{ flex: 27, backgroundColor: ZONE_COLORS[3] }} />
              <View style={{ flex: 13, backgroundColor: ZONE_COLORS[4] }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              {ZONE_LABELS.map((z, i) => (
                <View key={z} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ZONE_COLORS[i] }} />
                  <Text style={{ fontSize: 9, fontFamily: 'DMMono_400Regular', color: T.textMuted }}>{z}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Next WOD hint */}
          <View style={styles.nextWod}>
            <Text style={{ fontSize: 20 }}>⚡</Text>
            <View>
              <Text style={styles.nextWodTitle}>Prochain WOD</Text>
              <Text style={styles.nextWodSub}>Lundi 5 Mai — CrossFit SUD</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeBtnText: {
    color: T.textSecondary,
    fontSize: 13,
    fontFamily: 'DMMono_400Regular',
  },
  phoneShell: {
    width: 260,
    backgroundColor: T.bg0,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 60,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: '#2e2e3e',
    maxHeight: 640,
  },
  cameraStrip: {
    height: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraDot: {
    width: 8,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#222',
  },
  coverContent: {
    padding: 20,
    paddingBottom: 24,
    gap: 16,
  },
  clock: {
    fontSize: 52,
    fontFamily: 'DMMono_400Regular',
    color: T.textPrimary,
    lineHeight: 60,
    letterSpacing: -1.5,
  },
  clockDate: {
    fontSize: 12,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
    marginTop: 4,
  },
  lastSession: {
    backgroundColor: T.bg2,
    borderRadius: 14,
    padding: 12,
  },
  lastSessionName: {
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
  },
  lastSessionResult: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
  },
  lastSessionMeta: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
    marginTop: 3,
  },
  garminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  garminDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e03050',
  },
  garminMini: {
    fontSize: 11,
    fontFamily: 'DMMono_400Regular',
    color: T.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statTile: {
    width: '47%',
    backgroundColor: T.bg2,
    borderRadius: 12,
    padding: 10,
  },
  statVal: {
    fontSize: 22,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
  },
  statUnit: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
  },
  zoneBar: {
    backgroundColor: T.bg2,
    borderRadius: 12,
    padding: 10,
  },
  nextWod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(184,255,87,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(184,255,87,0.15)',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
  },
  nextWodTitle: {
    fontSize: 12,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
  },
  nextWodSub: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
  },
  bottomBar: {
    height: 8,
    backgroundColor: '#111',
  },
});
