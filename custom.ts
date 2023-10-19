
/**
* このファイルを使って、独自の関数やブロックを定義してください。
* 詳しくはこちらを参照してください：https://minecraft.makecode.com/blocks/custom
*/

/**
 * Custom blocks
 */
//% weight=100 color=#228b22 icon="◫"
namespace securityhack {
    let minPos = [36, 4, 15]
    let maxPos = [36, 4, 31]
    let playerWorldPos = [0, 0, 0]
    let playerPos = [0, 0]
    let X_MAX = 16
    let Y_MAX = 3
    let NONE = 0
    let WALL = 1
    let PLAYER = 2
    let GOAL = 3
    let U_DIR = 0
    let D_DIR = 1
    let L_DIR = 2
    let R_DIR = 3
    let mapData = [
        [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1], 
        [2, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], 
        [1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0], 
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 3, 0, 0, 0, 0, 0]]
        
    let clearData = [[2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 2], [2, 0, 0, 0, 2, 0, 2, 0, 2, 2, 0, 0, 2, 0, 0, 0, 2], [2, 0, 0, 0, 2, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2], [2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 2]]
    //  initmapData = [
    //      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    //      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //  ]
    let selectPosList = [[31, -2, 24], [31, -2, 22], [31, -2, 20], [31, -2, 26]]
    // u
    // d
    // l
    // r
    let putPos = world(-1, -1, 22)
    let isClear = false
    let time = 60
    // 色のIDをブロックのIDに変換する
    function ConvertBlock(bid: number): number {
        if (bid == NONE) {
            return BLACK_CONCRETE
        } else if (bid == WALL) {
            return GREEN_CONCRETE
        } else if (bid == PLAYER) {
            return LIME_CONCRETE
        } else if (bid == GOAL) {
            return RED_CONCRETE
        }

        return -1
    }

    function Init() {
        let i: number;

        for (i = 0; i < 3; i++) {
            blocks.fill(ConvertBlock(WALL), world(minPos[0], minPos[1], minPos[2]), world(minPos[0], minPos[1] - Y_MAX, minPos[2] + X_MAX), FillOperation.Replace)
            loops.pause(200)
            blocks.fill(ConvertBlock(NONE), world(minPos[0], minPos[1], minPos[2]), world(minPos[0], minPos[1] - Y_MAX, minPos[2] + X_MAX), FillOperation.Replace)
            loops.pause(200)
        }
        for (i = 0; i < Y_MAX + 1; i += 1) {
            for (let j = 0; j < X_MAX + 1; j += 1) {
                let placePos = world(minPos[0], minPos[1] - i, minPos[2] + j)
                if (mapData[i][j] == NONE) {
                    blocks.fill(ConvertBlock(NONE), placePos, placePos, FillOperation.Replace)
                } else if (mapData[i][j] == WALL) {
                    blocks.fill(ConvertBlock(WALL), placePos, placePos, FillOperation.Replace)
                } else if (mapData[i][j] == PLAYER) {
                    blocks.fill(ConvertBlock(PLAYER), placePos, placePos, FillOperation.Replace)
                    playerPos[0] = i
                    playerPos[1] = j
                } else if (mapData[i][j] == GOAL) {
                    blocks.fill(ConvertBlock(GOAL), placePos, placePos, FillOperation.Replace)
                }

            }
        }
    }

    function PlaceClear() {

        for (let i = 0; i < Y_MAX + 1; i += 1) {
            for (let j = 0; j < X_MAX + 1; j += 1) {

                let placePos = world(minPos[0], minPos[1] - i, minPos[2] + j)
                if (clearData[i][j] == NONE) {
                    blocks.fill(ConvertBlock(NONE), placePos, placePos, FillOperation.Replace)
                } else if (clearData[i][j] == WALL) {
                    blocks.fill(ConvertBlock(WALL), placePos, placePos, FillOperation.Replace)
                } else if (clearData[i][j] == PLAYER) {
                    blocks.fill(ConvertBlock(PLAYER), placePos, placePos, FillOperation.Replace)
                } else if (clearData[i][j] == GOAL) {
                    blocks.fill(ConvertBlock(GOAL), placePos, placePos, FillOperation.Replace)
                }
            }
        }
    }

    function PlaceFailed() {
        for (let i = 0; i < 5; i++) {
            blocks.fill(ConvertBlock(NONE), world(minPos[0], minPos[1], minPos[2]), world(minPos[0], minPos[1] - Y_MAX, minPos[2] + X_MAX), FillOperation.Replace)
            loops.pause(200)
            blocks.fill(ConvertBlock(GOAL), world(minPos[0], minPos[1], minPos[2]), world(minPos[0], minPos[1] - Y_MAX, minPos[2] + X_MAX), FillOperation.Replace)
            loops.pause(200)
        }
    }

    function MoveDir(movedir: number) {

        let currentPos = [0, 0]
        currentPos[0] = playerPos[0]
        currentPos[1] = playerPos[1]
        if (movedir == U_DIR) {
            currentPos[0] -= 1
        } else if (movedir == D_DIR) {
            currentPos[0] += 1
        } else if (movedir == L_DIR) {
            currentPos[1] -= 1
        } else if (movedir == R_DIR) {
            currentPos[1] += 1
        }

        if (!(0 <= currentPos[0] && currentPos[0] <= Y_MAX && (0 <= currentPos[1] && currentPos[1] <= X_MAX))) {
            // player.say("out range!")
            return
        }

        if (mapData[currentPos[0]][currentPos[1]] == WALL) {
            // player.say("wall!")
            return
        }

        // 元いたブロックを置き換える
        blocks.place(ConvertBlock(NONE), world(minPos[0], minPos[1] - playerPos[0], minPos[2] + playerPos[1]))
        blocks.place(ConvertBlock(PLAYER), world(minPos[0], minPos[1] - currentPos[0], minPos[2] + currentPos[1]))
        if (mapData[currentPos[0]][currentPos[1]] == GOAL) {
            isClear = true
        }

        //  elif mapData[currentPos[0]][currentPos[1]] == NONE:
        //      #player.say("move!")
        //      pass
        mapData[playerPos[0]][playerPos[1]] = NONE
        mapData[currentPos[0]][currentPos[1]] = PLAYER
        playerPos[0] = currentPos[0]
        playerPos[1] = currentPos[1]
        return
    }

    function IsEnd() {

        return 0 < time && !isClear
    }

    /**
     * TODO: ターミナルに侵入する
     */
    //% block
    export function SecurityHack() {

        let LPos = world(selectPosList[L_DIR][0], selectPosList[L_DIR][1], selectPosList[L_DIR][2])
        let RPos = world(selectPosList[R_DIR][0], selectPosList[R_DIR][1], selectPosList[R_DIR][2])
        let UPos = world(selectPosList[U_DIR][0], selectPosList[U_DIR][1], selectPosList[U_DIR][2])
        let DPos = world(selectPosList[D_DIR][0], selectPosList[D_DIR][1], selectPosList[D_DIR][2])
        let clickPos = world(0, 0, 0)
        let isClick = false
        Init()
        player.execute("/title @a title Start!")
        loops.runInBackground(function Timer() {

            while (IsEnd()) {
                loops.pause(1000)
                time -= 1
                if (time % 10 == 0) {
                    player.say(time + "s")
                }

            }
        })
        while (IsEnd()) {
            if (blocks.testForBlock(EMERALD_BLOCK, LPos)) {
                MoveDir(L_DIR)
                clickPos = LPos
                isClick = true
            } else if (blocks.testForBlock(EMERALD_BLOCK, RPos)) {
                MoveDir(R_DIR)
                clickPos = RPos
                isClick = true
            } else if (blocks.testForBlock(EMERALD_BLOCK, UPos)) {
                MoveDir(U_DIR)
                clickPos = UPos
                isClick = true
            } else if (blocks.testForBlock(EMERALD_BLOCK, DPos)) {
                MoveDir(D_DIR)
                clickPos = DPos
                isClick = true
            }

            if (isClick) {
                isClick = false
                blocks.place(AIR, clickPos)
            }

        }
        if (isClear) {
            PlaceClear()
            blocks.place(AIR, putPos)
        } else {
            PlaceFailed()
        }

    }

}
