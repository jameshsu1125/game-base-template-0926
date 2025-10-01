# 特殊 Tile 連鎖反應功能說明

## 已實現的功能

### 1. 特殊 Tile 連鎖反應

- 當特殊 tile 被激活時，如果爆炸範圍內有其他特殊 tile，會自動觸發連鎖反應
- 使用 `Set<string>` 記錄已處理的 tile，防止無限循環
- 支持三種特殊 tile 類型：
  - 3x3 爆炸 (`MATCH3_RGB_COLORS.length`)
  - 水平爆炸 (`MATCH3_RGB_COLORS.length + 1`)
  - 垂直爆炸 (`MATCH3_RGB_COLORS.length + 2`)

### 2. 特殊 Tile 之間的交換

- 當兩個特殊 tile 被交換時，會同時激活兩個 tile 並觸發連鎖反應
- 當一個特殊 tile 和普通 tile 交換時，會激活特殊 tile 並觸發連鎖反應
- 特殊 tile 被激活時不會執行普通的交換動畫，而是立即觸發爆炸效果

### 3. 點擊激活

- 點擊特殊 tile 會立即激活並觸發連鎖反應
- 保持原有的 manager 通知機制

## 實現細節

### 核心方法

1. `triggerChainReaction()`: 處理連鎖反應邏輯
2. `activateSpecialTilePair()`: 處理兩個特殊 tile 交換的情況
3. `activateSingleSpecialTile()`: 處理單個特殊 tile 激活的情況
4. 修改了 `explode3x3()`, `explodeHorizontal()`, `explodeVertical()` 方法以支持連鎖反應

### 連鎖反應機制

- 使用遞迴方式處理連鎖反應
- 每個爆炸方法會收集被影響的特殊 tile
- 通過 `triggerChainReaction()` 遞迴激活這些特殊 tile
- 使用 `Set<string>` 防止同一個 tile 被重複處理

## 測試場景

1. 將兩個特殊 tile 放在相鄰位置並交換
2. 創建一個包含多個特殊 tile 的區域，激活其中一個
3. 測試不同類型的特殊 tile 組合（3x3 + 水平、垂直 + 3x3 等）
