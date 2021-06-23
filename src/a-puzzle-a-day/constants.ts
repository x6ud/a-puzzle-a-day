export const GRID_SIZE = 42;
export const FONT_SIZE = 12;

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const BOARD: string[][] = [
    ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
    ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    ['1', '2', '3', '4', '5', '6', '7'],
    ['8', '9', '10', '11', '12', '13', '14'],
    ['15', '16', '17', '18', '19', '20', '21'],
    ['22', '23', '24', '25', '26', '27', '28'],
    ['29', '30', '31']
];

export type PieceDef = {
    color: [number, number, number],
    mask: number[][]
};

export const PIECES: PieceDef[] = [
    {
        color: [0xff / 0xff, 0x29 / 0xff, 0x29 / 0xff],
        mask: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0]
        ]
    },
    {
        color: [0xff / 0xff, 0x7a / 0xff, 0x29 / 0xff],
        mask: [
            [1, 0, 1],
            [1, 1, 1]
        ]
    },
    {
        color: [0xfa / 0xff, 0xd0 / 0xff, 0x2e / 0xff],
        mask: [
            [0, 0, 1],
            [1, 1, 1],
            [1, 0, 0]
        ]
    },
    {
        color: [0xbf / 0xff, 0x7f / 0xff, 0x35 / 0xff],
        mask: [
            [0, 0, 1, 1],
            [1, 1, 1, 0]
        ]
    },
    {
        color: [0x36 / 0xff, 0xd8 / 0xff, 0xb7 / 0xff],
        mask: [
            [1, 0],
            [1, 1],
            [1, 0],
            [1, 0]
        ]
    },
    {
        color: [0x3b / 0xff, 0x8a / 0xff, 0xff / 0xff],
        mask: [
            [1, 1],
            [0, 1],
            [0, 1],
            [0, 1]
        ]
    },
    {
        color: [0x99 / 0xff, 0x1e / 0xff, 0xf9 / 0xff],
        mask: [
            [1, 1, 0],
            [1, 1, 1]
        ]
    },
    {
        color: [0xff / 0xff, 0x5d / 0xff, 0xcd / 0xff],
        mask: [
            [1, 1, 1],
            [1, 1, 1]
        ]
    }
];

export const ROWS = BOARD.length;
export const COLS = BOARD.reduce((max, row) => Math.max(max, row.length), 0);