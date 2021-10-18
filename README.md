# cronos-dcrop.client.v1.dev.github.io
dcropクライアント側開発用リポジトリ

# 対応本体Ver.
- MN-1.0.3　　:　接続先サーバー切り替え処理実装


# サーバー切り替え動作確認方法
-前提
 サーバーの切り替え処理が意図通りに動作しているかの確認のため、デフォルトのサーバーを停止する必要があるが、
デフォルトの接続先であるAyameを停止することができない。<br>
そのため、停止可能なCronos-Ayameを標準に変更し、Cronos-Ayameを停止することで
切り替えが動作していることを確認する。<br>

-デフォルトの接続先変更方法
変更箇所 ./dcrop/js/dcrop.js 2行目<br>
変更前：`signalingServer = 'Ayame';`<br>
変更後：`signalingServer = 'Cronos';`<br>