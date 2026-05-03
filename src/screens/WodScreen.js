import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, ZONE_COLORS } from '../theme';
import { Card, Lbl, Chip, ZoneBar } from '../ui';
import { useApp } from '../AppContext';

const WOD_FORMATS = ['FOR TIME', 'AMRAP', 'EMOM', 'STRENGTH', 'CHIPPER', 'HERO'];
const SCALE_OPTIONS = ['Rx', 'Rx+', 'Scaled'];

export default function WodScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addWod } = useApp();

  const [format, setFormat] = useState('FOR TIME');
  const [isDrop, setIsDrop] = useState(false);
  const [box, setBox] = useState('CrossFit SUD');
  const [coach, setCoach] = useState('');
  const [movements, setMovements] = useState([{ name: '', detail: '' }]);
  const [result, setResult] = useState('');
  const [scale, setScale] = useState('Rx');
  const [notes, setNotes] = useState('');
  const [cal, setCal] = useState('');
  const [fcMax, setFcMax] = useState('');
  const [z2, setZ2] = useState('');
  const [z3, setZ3] = useState('');
  const [saved, setSaved] = useState(false);

  const addMvt = () => setMovements(m => [...m, { name: '', detail: '' }]);
  const removeMvt = i => setMovements(m => m.filter((_, j) => j !== i));
  const updateMvt = (i, field, val) =>
    setMovements(m => m.map((x, j) => j === i ? { ...x, [field]: val } : x));

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateLabel = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const handleSave = async () => {
    const garmin = (cal || fcMax || z2 || z3)
      ? { cal: Number(cal) || 0, fcMax: Number(fcMax) || 0, z2: Number(z2) || 0, z3: Number(z3) || 0, z4: 0, z5: 0 }
      : null;
    await addWod({
      date: dateLabel,
      type: format,
      name: movements[0]?.name || 'WOD',
      result,
      scale,
      box,
      coach,
      drop: isDrop,
      city: '',
      notes,
      movements,
      garmin,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigation.navigate('Histo');
    }, 1400);
  };

  const showZonePreview = !!(z2 || z3);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg0 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22, paddingBottom: 14 }}>
        <Lbl>NOUVEAU WOD</Lbl>
        <Text style={styles.screenTitle}>{dateLabel}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 32, gap: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Format */}
        <View style={{ gap: 8 }}>
          <Lbl>FORMAT</Lbl>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {WOD_FORMATS.map(f => (
              <Chip key={f} label={f} active={format === f} onPress={() => setFormat(f)} />
            ))}
          </View>
        </View>

        {/* Box */}
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setIsDrop(false)}
              style={[styles.boxBtn, { backgroundColor: !isDrop ? T.accentColor : T.bg3 }]}
            >
              <Text style={[styles.boxBtnText, { color: !isDrop ? T.bg0 : T.textSecondary }]}>📍 Ma box</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsDrop(true)}
              style={[styles.boxBtn, { backgroundColor: isDrop ? T.dropColor : T.bg3 }]}
            >
              <Text style={[styles.boxBtnText, { color: isDrop ? '#fff' : T.textSecondary }]}>✈️ Drop-in</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Lbl>BOX</Lbl>
              <TextInput
                value={box}
                onChangeText={setBox}
                style={styles.input}
                placeholderTextColor={T.textMuted}
              />
            </View>
            <View style={{ width: 105, gap: 4 }}>
              <Lbl>COACH</Lbl>
              <TextInput
                value={coach}
                onChangeText={setCoach}
                placeholder="Romain"
                style={styles.input}
                placeholderTextColor={T.textMuted}
              />
            </View>
          </View>
        </Card>

        {/* Mouvements */}
        <View style={{ gap: 6 }}>
          <Lbl>MOUVEMENTS</Lbl>
          {movements.map((m, i) => (
            <View key={i} style={styles.mvtRow}>
              <View style={styles.mvtDot} />
              <TextInput
                value={m.name}
                onChangeText={v => updateMvt(i, 'name', v)}
                placeholder="Mouvement…"
                style={styles.mvtNameInput}
                placeholderTextColor={T.textMuted}
              />
              <TextInput
                value={m.detail}
                onChangeText={v => updateMvt(i, 'detail', v)}
                placeholder="détail"
                style={styles.mvtDetailInput}
                placeholderTextColor={T.textMuted}
              />
              <TouchableOpacity onPress={() => removeMvt(i)} style={styles.mvtRemoveBtn}>
                <Text style={{ color: T.textMuted, fontSize: 15 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addMvt} style={styles.addMvtBtn}>
            <Text style={{ fontSize: 18, color: T.accentColor, lineHeight: 22 }}>+</Text>
            <Text style={{ fontSize: 14, color: T.textMuted, fontFamily: 'DMSans_400Regular' }}>Ajouter un mouvement</Text>
          </TouchableOpacity>
        </View>

        {/* Résultat + scale */}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Lbl>RÉSULTAT</Lbl>
            <TextInput
              value={result}
              onChangeText={setResult}
              placeholder="ex: 3:47"
              style={[styles.input, { fontSize: 20, fontFamily: 'DMSans_700Bold', paddingVertical: 10 }]}
              placeholderTextColor={T.textMuted}
            />
          </View>
          <View style={{ width: 88, gap: 4 }}>
            <Lbl>SCALE</Lbl>
            <View style={{ gap: 6 }}>
              {SCALE_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setScale(s)}
                  style={[styles.scaleBtn, { backgroundColor: scale === s ? T.accentColor : T.bg2 }]}
                >
                  <Text style={{ fontSize: 14, fontFamily: 'DMSans_700Bold', color: scale === s ? T.bg0 : T.textSecondary }}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={{ gap: 4 }}>
          <Lbl>NOTES</Lbl>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Sensations, commentaires…"
            style={[styles.input, { height: 72, textAlignVertical: 'top', paddingTop: 10 }]}
            placeholderTextColor={T.textMuted}
            multiline
          />
        </View>

        {/* Garmin */}
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14, color: T.accentColor }}>⚡</Text>
            <Lbl style={{ color: T.accentColor }}>DONNÉES GARMIN</Lbl>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Lbl>CALORIES (kcal)</Lbl>
              <TextInput
                value={cal}
                onChangeText={setCal}
                placeholder="ex: 380"
                keyboardType="numeric"
                style={[styles.input, { fontSize: 16, fontFamily: 'DMSans_700Bold' }]}
                placeholderTextColor={T.textMuted}
              />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Lbl>FC MAX (bpm)</Lbl>
              <TextInput
                value={fcMax}
                onChangeText={setFcMax}
                placeholder="ex: 187"
                keyboardType="numeric"
                style={[styles.input, { fontSize: 16, fontFamily: 'DMSans_700Bold', color: '#e03050' }]}
                placeholderTextColor={T.textMuted}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#4abf7a' }} />
                <Lbl>ZONE 2 (%)</Lbl>
              </View>
              <TextInput
                value={z2}
                onChangeText={setZ2}
                placeholder="ex: 28"
                keyboardType="numeric"
                style={[styles.input, { fontSize: 16, fontFamily: 'DMSans_700Bold', color: '#4abf7a' }]}
                placeholderTextColor={T.textMuted}
              />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#f5c842' }} />
                <Lbl>ZONE 3 (%)</Lbl>
              </View>
              <TextInput
                value={z3}
                onChangeText={setZ3}
                placeholder="ex: 34"
                keyboardType="numeric"
                style={[styles.input, { fontSize: 16, fontFamily: 'DMSans_700Bold', color: '#f5c842' }]}
                placeholderTextColor={T.textMuted}
              />
            </View>
          </View>
          {showZonePreview && (
            <View>
              <Lbl style={{ marginBottom: 8 }}>APERÇU ZONES</Lbl>
              <ZoneBar z2={Number(z2) || 0} z3={Number(z3) || 0} z4={0} z5={0} />
            </View>
          )}
        </Card>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, { backgroundColor: saved ? '#5abf7a' : T.accentColor }]}
        >
          <Text style={styles.saveBtnText}>
            {saved ? '✓ WOD enregistré !' : 'Enregistrer le WOD'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  input: {
    backgroundColor: T.bg3,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: T.textPrimary,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },
  boxBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxBtnText: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
  },
  mvtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 10,
  },
  mvtDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.accentColor,
  },
  mvtNameInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: T.textPrimary,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
    minWidth: 0,
  },
  mvtDetailInput: {
    width: 88,
    backgroundColor: 'transparent',
    color: T.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'right',
  },
  mvtRemoveBtn: {
    padding: 4,
  },
  addMvtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: T.bg3,
    borderRadius: T.cardRadius,
    padding: 10,
  },
  scaleBtn: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtn: {
    height: 52,
    borderRadius: T.cardRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveBtnText: {
    color: T.bg0,
    fontSize: 17,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 0.4,
  },
});
