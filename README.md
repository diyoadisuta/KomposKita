![Logo_KomposKita](https://github.com/user-attachments/assets/5b204b8f-b62e-4746-a493-4fee5ee0afd3)

# Our Team
|          Nama         | Cohort-ID |       Path       |
|:---------------------:|:----------:|:----------------:|
|  Muhammad Fauzani Akbar  |  MC528D5Y0070   | Machine Learning |
|  Mochammad Syafiq Ilallah  |  MC006D5Y2189   | Machine Learning |
|  Dewi Puspita    |  MC834D5X1362  |   Machine Learning |
|  Delvia   |  FC153D5X0576   |  FEBE |
|  Delwinro Purba Siboro  |  FC304D5Y0867   |  FEBE |
|  Dio Adista Laksono     |  FC458D5Y2266   |      FEBE     |

# Project Overview
Menurut data dari Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) per tahun 2024, komposisi sampah terbesar berasal dari Rumah Tangga dengan proporsi 50.79% dan jenis sampah terbesar adalah Sisa Makanan dengan proporsi 39.35%. Banyak sampah rumah tangga yang seharusnya dapat dimanfaatkan justru berakhir di tempat pembuangan akhir. Permasalahan yang ingin kami atasi adalah rendahnya kesadaran masyarakat terhadap potensi sampah rumah tangga melalui praktik komposting. Oleh karena itu, kami merumuskan pertanyaan penelitian sebagai berikut: Bagaimana membantu masyarakat mengenali sampah yang layak untuk digunakan sebagai bahan komposting agar masyarakat dapat mengurangi limbah sekaligus menghasilkan kompos berkualitas? Dengan latar belakang tersebut, kami bertujuan mengembangkan sebuah aplikasi untuk memberikan informasi kepada pengguna mengenai sampah rumah tangga yang layak digunakan sebagai bahan komposting dan rekomendasi rasio yang tepat untuk proses dekomposisi yang optimal dalam menghasilkan kompos berkualitas sebagai solusi yang mudah diakses, edukatif, dan aplikatif. Kami berharap aplikasi website ini mampu membantu masyarakat memahami bahwa sisa sampah rumah tangga bukan hanya menjadi limbah, melainkan sumber daya yang berharga dan dapat dimanfaatkan untuk mendukung keberlanjutan lingkungan.

# Business Understanding
## Problem Statement
1. Masyarakat masih kurang menyadari bahwa sampah rumah tangga, terutama sisa makanan, dapat dimanfaatkan melalui proses komposting untuk menghasilkan kompos berkualitas.
2. Banyak individu tidak memiliki pengetahuan yang memadai mengenai jenis sampah organik yang dapat digunakan dalam proses komposting, sehingga potensi pengurangan limbah organik tidak termanfaatkan secara maksimal.
3. Terbatasnya panduan yang mudah diakses dan aplikatif mengenai cara melakukan komposting di rumah menyebabkan masyarakat enggan memulai praktik ini.

## Goal
1. Mengembangkan website yang edukatif untuk memberikan informasi mengenai manfaat komposting dan jenis sampah rumah tangga yang layak digunakan sebagai bahan kompos.
2. Menyediakan fitur dalam website yang memberikan langkah-langkah praktis dan rekomendasi rasio bahan kompos untuk membantu pengguna melakukan komposting secara efektif di rumah.
3. Melalui edukasi dan panduan praktis, website ini bertujuan untuk mendorong masyarakat mengolah sampah organik mereka sendiri, sehingga mengurangi volume sampah yang dikirim ke tempat pemrosesan akhir.

# Technologies
## Machine Learning 
- keras
- matplotlib
- Pillow
- protobuf
- scikit_learn
- seaborn
- tensorflow
- tensorflowjs

**🧠 Machine Learning untuk Klasifikasi Sampah Kompos**

Proyek ini menggunakan **Google Colab** karena keterbatasan spesifikasi laptop/PC. Kami membuat model klasifikasi sampah menjadi tiga kelas utama:

1. **Sampah Organik Basah (Layak Kompos)**
2. **Sampah Organik Kering (Layak Kompos)**
3. **Sampah Tidak Layak Kompos**

Dataset berisi **12.464 gambar sampah** dan kami menyimpannya di Google Drive. Data dibagi ke **train/validation/test** dan di-*resize* ke 512x512 piksel.

🧩 Model dikembangkan menggunakan:

* **MobileNetV2 (Transfer Learning)** untuk efisiensi dan akurasi tinggi.
* **Adam Optimizer** dan **Categorical Crossentropy Loss**.
* **EarlyStopping**, **ReduceLROnPlateau**, dan **ModelCheckpoint** sebagai *callbacks*.
* Disimpan model terbaik dalam format `.h5`.

📈 Akurasi pengujian mencapai **>95%**.
📊 Evaluasi mencakup *confusion matrix* dan *classification report*.

✨ Model juga dapat dipakai langsung untuk memprediksi gambar baru via upload.
🌐 Terakhir, model dikonversi ke **save_model** agar bisa dijalankan langsung di browser (web-based).

## Front End
- Next
- 
penjelasan


# Contact
|          Nama         | Email |       Path       |
|:---------------------:|:----------:|:----------------:|
|  Muhammad Fauzani Akbar  |  fauzanmhd504@gmail.com   | Machine Learning |
|  Mochammad Syafiq Ilallah  |  mochammadsyafiq@student.ub.ac.id   | Machine Learning |
|  Dewi Puspita    |  dewi944puspita@gmail.com  |   Machine Learning |
|  Delvia   |  delvia.yi39@gmail.com   |  FEBE |
|  Delwinro Purba Siboro  |  dev588sibolis@gmail.com   |  FEBE |
|  Dio Adista Laksono     |  diyoadisuta@gmail.com   |      FEBE     |
