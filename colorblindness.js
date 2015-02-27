function applyFilterToLayer(filterName, bitmapLayer){
  var CIImageFromLayer = CIImageFromBitmapLayer(bitmapLayer)
  var filter = getFilterNamed(filterName)
  [filter setValue:CIImageFromLayer forKey:"inputImage"]

  var transformedImage = [filter valueForKey:"outputImage"]
  var rawImage = NSImageFromImage(transformedImage)
  var collection = bitmapLayer.documentData().images()
  [bitmapLayer setRawImage:rawImage convertColourspace:false collection:collection]
}

function CIImageFromBitmapLayer(layer)/*MSBitmapLayer*/{
  var image = layer.image().image()
  var original = [image copy]
  return [CIImage imageWithCGImage:[original CGImageForProposedRect:nil context:nil hints:nil]]
}

function NSImageFromImage(ciImage)/* CIIMage */ {
  NSCIImageRep_rep = [NSCIImageRep imageRepWithCIImage:ciImage]
  NSImage_nsImage = [[NSImage alloc] initWithSize:NSCIImageRep_rep.size]
  [NSImage_nsImage addRepresentation:NSCIImageRep_rep]
  return NSImage_nsImage;
}

function getFilterNamed(filterName){
  var filter = [CIFilter filterWithName:"CIColorMatrix"]
  [filter setDefaults]

  // Numbers from https://github.com/chockenberry/VisionDefectSimulation/blob/master/Retination/VisionDefectSimulation.m#L273-L293
  // See also: http://colrd.com/labs/colormatrix/
  // See also: http://mudcu.be/labs/Color-Vision/Javascript/Color.Vision.Daltonize.js
  // http://disturbmedia.com/workspace/blog-resources/colour-blindness.html
  switch (filterName) {
    case "protanopia":
      [filter setValue:[CIVector vectorWithX: 0.202001295331   Y:  0.991720719265  Z: -0.193722014597  W: 0] forKey:'inputRVector']
      [filter setValue:[CIVector vectorWithX: 0.163800203026   Y:  0.792663865514  Z:  0.0435359314602 W: 0] forKey:'inputGVector']
      [filter setValue:[CIVector vectorWithX: 0.00913336570448 Y: -0.0132684300993 Z:  1.00413506439   W: 0] forKey:'inputBVector']
      break;
    case "deuteranopia":
      [filter setValue:[CIVector vectorWithX:  0.430749076295  Y: 0.717402505462  Z: -0.148151581757  W: 0] forKey:'inputRVector']
      [filter setValue:[CIVector vectorWithX:  0.336582831043  Y: 0.574447762213  Z:  0.0889694067435 W: 0] forKey:'inputGVector']
      [filter setValue:[CIVector vectorWithX: -0.0236572929497 Y: 0.0275635332006 Z:  0.996093759749  W: 0] forKey:'inputBVector']
      break;
    case "tritanopia":
      /* original */
      [filter setValue:[CIVector vectorWithX:  0.971710712275  Y: 0.112392320487 Z: -0.0841030327623 W: 0] forKey:'inputRVector']
      [filter setValue:[CIVector vectorWithX:  0.0219508442818 Y: 0.817739672383 Z:  0.160309483335  W: 0] forKey:'inputGVector']
      [filter setValue:[CIVector vectorWithX: -0.0628595877201 Y: 0.880724870686 Z:  0.182134717034  W: 0] forKey:'inputBVector']
      
      break;
  }
  return filter;
}
