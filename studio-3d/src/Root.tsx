import React from "react";
import { Composition } from "remotion";
import { SolarVideo } from "./scenes/SolarScene";
import { BlackHoleVideo } from "./scenes/BlackHoleScene";
import { LightningVideo } from "./scenes/LightningScene";
import { ProcrastinationVideo } from "./scenes/ProcrastinationScene";
import { CruiseShipVideo } from "./scenes/CruiseShipScene";
import {
  V06Video, V07Video, V08Video, V09Video, V10Video,
  V11Video, V12Video, V13Video, V14Video, V15Video,
} from "./scenes/BatchScenes";
import timing01 from "./timing_01_matahari.json";
import timing02 from "./timing_02_lubang_hitam.json";
import timing03 from "./timing_03_petir.json";
import timing04 from "./timing_04_menunda.json";
import timing05 from "./timing_05_kapal_pesiar.json";
import t06 from "./timing_v06_rokok_paru.json";
import t07 from "./timing_v07_pil_tubuh.json";
import t08 from "./timing_v08_otak_bicara_negatif.json";
import t09 from "./timing_v09_orang_pendiam.json";
import t10 from "./timing_v10_procrastinate2.json";
import t11 from "./timing_v11_buah_obat.json";
import t12 from "./timing_v12_buah_sahabat.json";
import t13 from "./timing_v13_ai_cartoon.json";
import t14 from "./timing_v14_ai_story_moral.json";
import t15 from "./timing_v15_teknologi_ai.json";

const FPS = 30;
const C = (Comp: React.FC, timing: any, id: string) => (
  <Composition id={id} component={Comp} durationInFrames={Math.ceil(timing.total_dur * FPS)} fps={FPS} width={720} height={1280} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {C(SolarVideo, timing01, "SolarExplosion")}
      {C(BlackHoleVideo, timing02, "BlackHoleTime")}
      {C(LightningVideo, timing03, "LightningStrike")}
      {C(ProcrastinationVideo, timing04, "BrainIncubation")}
      {C(CruiseShipVideo, timing05, "CruiseShipDrop")}
      {C(V06Video, t06, "V06RokokParu")}
      {C(V07Video, t07, "V07PilTubuh")}
      {C(V08Video, t08, "V08OtakBicaraNegatif")}
      {C(V09Video, t09, "V09OrangPendiam")}
      {C(V10Video, t10, "V10Procrastinate2")}
      {C(V11Video, t11, "V11BuahObat")}
      {C(V12Video, t12, "V12BuahSahabat")}
      {C(V13Video, t13, "V13AICartoon")}
      {C(V14Video, t14, "V14AIStoryMoral")}
      {C(V15Video, t15, "V15TeknologiAI")}
    </>
  );
};
