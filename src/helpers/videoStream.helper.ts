export type VideoStreamData = {
    videoPath: string,
    byteRange: [number, number],
    videoSize: number
}

/**
 * Extracts start and end byte from range header. If couldnt be extracted, provides default start and
 * end bytes.
 * @param videoSize 
 * @param rangeHeader 
 */
export const determineStartAndEndBytes = (videoSize: number, rangeHeader: string): [ number, number ] => {    
    let [startByte, endByte] = extratStartAndEndByteFromRangeHeader(rangeHeader);
    
    startByte = startByte || 0;
    endByte = endByte || calculateDefaultEndByte(startByte, videoSize);

    return [startByte, endByte];
}

/**
 * Extracts start and end bytes from the range header.
 * @param rangeHeader 
 */
const extratStartAndEndByteFromRangeHeader = (rangeHeader: string): [number|undefined, number|undefined] => {
    const parsedRangeHeader = rangeHeader.replace(/bytes=/, '').split('-');

    const startByte = (parsedRangeHeader[0] && parseInt(parsedRangeHeader[0]) || undefined);
    const endByte = (parsedRangeHeader[1] && parseInt(parsedRangeHeader[1]) || undefined);

    return [startByte, endByte];
}

/**
 * Calculates the default end byte on the basis of start byte and video size..
 * @param startByte 
 * @param videoSize 
 */
const calculateDefaultEndByte = (startByte: number, videoSize: number): number => {
    const CHUNK_SIZE = 10 ** 6; // 1 Megabytes.
    return Math.min(startByte + CHUNK_SIZE, videoSize - 1);
}