"""Tạo MP3 tại thời điểm build, không gọi API khi du khách dùng web.

Cần piper-tts==1.3.0, ffmpeg/ffprobe và hai model đã tải riêng.
Model không được đưa lên GitHub Pages. Chạy lại là tùy chọn; MP3 đã có sẵn.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
MODELS = {
    'vi': ('vits-piper-vi_VN-vais1000-medium', 'vi_VN-vais1000-medium', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'),
    'en': ('vits-piper-en_US-ljspeech-medium', 'en_US-ljspeech-medium', 'Public domain dataset', 'https://keithito.com/LJ-Speech-Dataset/'),
}
SLUGS = {'hv-khuyen-tai-ba-mau-f7a824': 'earring', 'phu-dieu': 'relief', 'sung-than-cong': 'cannon'}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def duration(path: Path) -> float:
    return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(path)], text=True)), 3)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--models-dir', required=True, type=Path)
    parser.add_argument('--languages', default='vi,en')
    parser.add_argument('--personas', default='quick,kids,deep')
    args = parser.parse_args()
    languages = args.languages.split(',')
    personas = args.personas.split(',')
    if any(persona not in ('quick','kids','deep') for persona in personas):
        parser.error('Giọng kể hợp lệ: quick,kids,deep')
    if not languages or any(lang not in MODELS for lang in languages):
        parser.error('Các model MP3 đã cấu hình: vi,en; ko/zh dùng Web Speech API.')
    if not shutil.which('ffmpeg') or not shutil.which('ffprobe'):
        parser.error('Cần cài ffmpeg và ffprobe trước khi tái tạo âm thanh.')
    from piper import PiperVoice, SynthesisConfig
    from piper.config import PiperConfig
    from piper.voice import ESPEAK_DATA_DIR
    import onnxruntime as ort
    ort.disable_telemetry_events()
    ort.set_default_logger_severity(3)
    raw = json.loads((ROOT/'data/demo-narrations.json').read_text())
    out = ROOT/'audio'
    out.mkdir(exist_ok=True)
    licenses = ROOT/'licenses/pocket-audio'
    licenses.mkdir(parents=True, exist_ok=True)
    model_info = []
    for lang in languages:
        folder, name, license_name, license_url = MODELS[lang]
        model_root = args.models_dir/folder
        model = model_root/(name+'.onnx')
        config = json.loads((model_root/(name+'.onnx.json')).read_text())
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 2
        opts.inter_op_num_threads = 1
        voice = PiperVoice(config=PiperConfig.from_dict(config), session=ort.InferenceSession(str(model), sess_options=opts, providers=['CPUExecutionProvider']), espeak_data_dir=Path(ESPEAK_DATA_DIR))
        card = licenses/(name+'-MODEL_CARD.md')
        shutil.copyfile(model_root/'MODEL_CARD', card)
        model_info.append({'language': lang, 'model': name, 'modelSha256': sha(model), 'modelCard': './licenses/pocket-audio/'+card.name, 'datasetLicense': license_name, 'datasetLicenseUrl': license_url, 'download': 'https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/'+folder+'.tar.bz2'})
        for record in raw['records']:
            for persona in raw['personas']:
                if persona not in personas:
                    continue
                story = record['stories'][lang][persona]
                text = story['text']
                # Dấu chấm hàng nghìn là định dạng hiển thị, không phải dấu thập phân.
                spoken = text.replace('2.500', '2500').replace('2.000', '2000') if lang == 'vi' else text
                target = out/f'{SLUGS[record["artifactId"]]}-{lang}-{persona}.mp3'
                with tempfile.TemporaryDirectory(prefix='museum-audio-') as temp:
                    wav = Path(temp)/'narration.wav'
                    with wave.open(str(wav), 'wb') as f:
                        voice.synthesize_wav(spoken, f, syn_config=SynthesisConfig(length_scale={'quick': 1.06, 'kids': 1.18, 'deep': 1.04}[persona], noise_scale=.45, noise_w_scale=.6))
                    filters = 'loudnorm=I=-18:TP=-2:LRA=7'
                    if persona == 'kids':
                        # loudnorm có thể nâng mẫu lên 192 kHz; hạ về 22.05 kHz trước đổi cao độ.
                        filters += ',aresample=22050,asetrate=22932,aresample=22050,atempo=0.961538'
                    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(wav), '-af', filters, '-ar', '22050', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '48k', '-map_metadata', '-1', str(target)], check=True)
                story.update(audio='./audio/'+target.name, durationSeconds=duration(target))
                print(lang, record['artifactId'], persona, story['durationSeconds'], target.stat().st_size, flush=True)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=22050:cl=mono', '-t', '0.18', '-codec:a', 'libmp3lame', '-b:a', '32k', str(out/'unlock.mp3')], check=True)
    # Chỉ kê những file thật có trên đĩa; không gắn URL giả cho bản ko/zh.
    files = []
    for record in raw['records']:
        for lang, stories in record['stories'].items():
            for persona, story in stories.items():
                if not story.get('audio'):
                    continue
                path = ROOT/story['audio']
                files.append({'path': story['audio'], 'artifactId': record['artifactId'], 'language': lang, 'persona': persona, 'bytes': path.stat().st_size, 'sha256': sha(path), 'durationSeconds': story['durationSeconds'], 'textSha256': hashlib.sha256(story['text'].encode()).hexdigest()})
    unlock = out/'unlock.mp3'
    files.append({'path': './audio/unlock.mp3', 'bytes': unlock.stat().st_size, 'sha256': sha(unlock), 'durationSeconds': duration(unlock), 'purpose': 'Silent gesture unlock, not narration'})
    (ROOT/'data/demo-narrations.json').write_text(json.dumps(raw, ensure_ascii=False, indent=2)+'\n')
    (out/'manifest.json').write_text(json.dumps({'schemaVersion': 1, 'files': files}, ensure_ascii=False, indent=2)+'\n')
    (out/'model-provenance.json').write_text(json.dumps({'engine': 'Piper 1.3.0, CPU, offline build only', 'modelsDistributed': False, 'models': model_info, 'styles': {'quick': 'Brief factual narration', 'kids': 'Slower delivery with a small pitch adjustment', 'deep': 'Longer source-based explanation'}, 'fallbackLanguages': ['ko', 'zh']}, ensure_ascii=False, indent=2)+'\n')


if __name__ == '__main__':
    main()
