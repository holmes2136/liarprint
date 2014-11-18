liarprint
=========

TARGET : 
```
主要為了解決套印時 , 需要可動態變換套印內容以及套印規則 , 
因此先將變動的內容藉由 javascript 動態產生 , 之後儲存到 DB , 
再經由後端產生 PDF , 目前此專案只有 DEMO 前端部份模組
   
```

Features : 
```
1. 依據 xml 設定動態變換套印規則
2. 依據 xml 設定動態變換套印文字
3. 依據 xml 設定動態變換套印權利說明
4. MONEY , DATE 等套印格式支援
   
```

Sample : 
```
假設畫面上如下附圖 : 
```
![alt text](https://dl.dropboxusercontent.com/u/23971112/github/2014-11-18_224016.jpg  "Title")

```
我們可能需要依據勾選不同項目而產生不同的文字內容 , 如下圖 , 當勾選 15 日 , 出現如下文字 : 
指定日為每月的15日 , 勾選 25 日則文字也會跟著變化 , 而文字產生的內容以及規則我們是以 xml 來設定
```
![alt text](https://dl.dropboxusercontent.com/u/23971112/github/2014-11-18_224412.jpg  "Title")



