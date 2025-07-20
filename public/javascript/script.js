
var t1 = gsap.timeline();
t1.from(".title",{
  scale: 0,
  opacity: 0,
  duration: 0.5,
  delay: 0.5,
  // scrollTrigger: ".title"
})
t1.from(".headanime1",{
  scale: 0,
  opacity: 0,
  duration: 0.7,
  ease: "power2.out",
  // scrollTrigger: ".headanime1"
})
t1.from(".shopanime",{
  y: -10,
  opacity: 0,
  duration: 0.7,
  // scrollTrigger: ".shopanime"
})
t1.from(".subhead2",{
  y: 10,
  opacity: 0,
  duration: 0.7,
  // scrollTrigger: ".subhead2"
})
t1.from(".sellanime",{
  scale: 0,
  opacity: 0,
  duration: 0.5,
  // scrollTrigger: ".sellanime"
})
t1.from(".head2",{
  y: -10,
  opacity: 0,
  duration: 0.5,
  // scrollTrigger: ".head2"
})
t1.from(".divanime",{
  scale: 0,
  opacity: 0,
  duration: 0.3,
  stagger: 0.5,
  // scrollTrigger: ".divanime"
})


