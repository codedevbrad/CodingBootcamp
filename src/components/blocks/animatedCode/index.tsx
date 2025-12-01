'use client'
import AnimatedCodeChallengev1 from "./package"
import type { animatedCodeChallengeBlock } from "./package/package.types"


export default function AnimatedCodeChallenge ( { data } : { data: animatedCodeChallengeBlock } ) {
    function onEnd ( ) {
        console.log('complete');
    }
    return (
        <>
            <AnimatedCodeChallengev1 {...data} onEnd={onEnd} />
        </>
    )
}
