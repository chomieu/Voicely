## Some important links:

* http://marcgg.com/blog/2016/11/01/javascript-audio/

Built a proof-of-concept that was only partially successful; apparently setInterval does NOT accept a different argument for the duration each time it iterates, so it's not really useful for controlling the duration of a musical note. If we still want to build a synthesizer, it might be more fruitful to experiment with a function that calls setTimeout() to call itself recursively. I'll probably mess with this if I have time this weekend after completing the assignment due Tuesday. - T