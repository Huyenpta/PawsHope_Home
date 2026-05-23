import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, Camera, AlertCircle, Send, PhoneCall, 
  Activity, Users, Stethoscope, Map, Hash
} from "lucide-react";

// Danh mục giống chó phân loại theo nhóm
const DOG_BREEDS = [
  { group: "Native Vietnamese", breeds: ["Phu Quoc Ridgeback", "Hmong Docked Tail", "Bac Ha Dog", "Native Mixed (Chó Ta)"] },
  { group: "Small Breeds", breeds: ["Poodle", "Chihuahua", "Pug", "Pomeranian", "Corgi", "French Bulldog"] },
  { group: "Medium Breeds", breeds: ["Shiba Inu", "Beagle", "Bull Terrier", "Dalmatian"] },
  { group: "Large Breeds", breeds: ["Golden Retriever", "Labrador", "Husky", "Alaska", "German Shepherd (Becgie)", "Pitbull", "Rottweiler"] },
  { group: "Other", breeds: ["Unknown", "Mixed Breed"] }
];

export const Rescue = () => {
  const [rescueId, setRescueId] = useState("");
  const [formData, setFormData] = useState({
    reporterName: '',
    phone: '',
    altPhone: '',
    urgency: '',
    animalType: '',
    breed: '',
    condition: '',
    estimatedWeight: '',
    environment: '',
    temperament: '',
    behavior: '',
    address: '',
    coordinates: '',
  });

  useEffect(() => {
    const code = "RSC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setRescueId(code);
  }, []);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFormData({ ...formData, coordinates: coords });
        alert("GPS Location Pinned!");
      });
    } else {
      alert("Please enable location services.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Final Rescue Data:", { ...formData, rescueId });
    alert(`Case ${rescueId} submitted. Help is on the way!`);
  };

  return (
    // translate="no" ở lớp ngoài cùng để bảo vệ toàn bộ trang khỏi Google Translate
    <div className="min-h-screen bg-[#fdfaf5] py-4 md:py-12" translate="no">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 md:mb-14 gap-6">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
              <AlertCircle size={14} className="animate-pulse" /> <span>24/7 Emergency Dispatch</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#2c5f51] uppercase tracking-tighter leading-[0.9]">
              Save a <span className="text-[#f6931d]">Life</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest pl-1">Fill out the form to alert our team</p>
          </div>

          <a href="tel:0988015445" className="w-full md:w-auto">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl md:rounded-full px-8 py-8 flex flex-col items-center shadow-xl transition-all active:scale-95">
              <div className="flex items-center gap-3 font-black text-xl uppercase tracking-tighter">
                <PhoneCall size={24} /> <span>Emergency Hotline</span>
              </div>
              <span className="text-xs font-bold opacity-80 tracking-[0.2em]">0988 015 445</span>
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Case ID Display */}
              <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 shadow-inner">
                <Hash size={18} className="text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Case Tracking ID:</span>
                <span className="text-sm font-black text-[#2c5f51]">{rescueId}</span>
              </div>

              {/* Section 1: Animal Profile */}
              <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white ring-1 ring-gray-100">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 text-[#f6931d]">
                    <div className="p-2 bg-orange-50 rounded-lg"><Activity size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-[#2c5f51]">1. Animal Profile</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select onValueChange={(v) => setFormData({...formData, animalType: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold">
                        <SelectValue placeholder="Species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="other">Other Species</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => setFormData({...formData, estimatedWeight: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold">
                        <SelectValue placeholder="Weight Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiny">Tiny ({"<"} 2kg)</SelectItem>
                        <SelectItem value="small">Small (2kg - 10kg)</SelectItem>
                        <SelectItem value="medium">Medium (10kg - 25kg)</SelectItem>
                        <SelectItem value="large">Large (25kg+)</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Breed Select - Full implementation */}
                    <Select onValueChange={(v) => setFormData({...formData, breed: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold md:col-span-2">
                        <SelectValue placeholder="Select Breed / Group" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {formData.animalType === 'dog' ? (
                          DOG_BREEDS.map((group) => (
                            <React.Fragment key={group.group}>
                              <div className="px-2 py-1.5 text-[10px] font-black text-gray-400 uppercase bg-gray-50/50">{group.group}</div>
                              {group.breeds.map((b) => (
                                <SelectItem key={b} value={b.toLowerCase()}>{b}</SelectItem>
                              ))}
                            </React.Fragment>
                          ))
                        ) : (
                          <>
                            <SelectItem value="domestic_shorthair">Domestic Shorthair (Mèo mướp)</SelectItem>
                            <SelectItem value="british_shorthair">British Shorthair (Mèo Anh)</SelectItem>
                            <SelectItem value="unknown">Unknown Breed</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Health & Status */}
              <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white ring-1 ring-gray-100">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 text-[#f6931d]">
                    <div className="p-2 bg-orange-50 rounded-lg"><Stethoscope size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-[#2c5f51]">2. Health & Status</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select onValueChange={(v) => setFormData({...formData, urgency: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold text-red-600">
                        <SelectValue placeholder="Urgency Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical (Life Threatening)</SelectItem>
                        <SelectItem value="urgent">Urgent (Injured)</SelectItem>
                        <SelectItem value="stable">Stable (Abandoned)</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => setFormData({...formData, condition: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold">
                        <SelectValue placeholder="Injury Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident">Traffic Accident</SelectItem>
                        <SelectItem value="poison">Poisoning</SelectItem>
                        <SelectItem value="abuse">Abuse / Trapped</SelectItem>
                        <SelectItem value="skin">Skin Disease</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => setFormData({...formData, temperament: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold">
                        <SelectValue placeholder="Temperament" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="scared">Scared</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => setFormData({...formData, behavior: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold">
                        <SelectValue placeholder="Behavior" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staying">Staying still</SelectItem>
                        <SelectItem value="running">Running away</SelectItem>
                        <SelectItem value="hiding">Hiding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Environment & Location */}
              <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white ring-1 ring-gray-100">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 text-[#f6931d]">
                    <div className="p-2 bg-orange-50 rounded-lg"><Map size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-[#2c5f51]">3. Location & Environment</h3>
                  </div>
                  <div className="space-y-4">
                    <Select onValueChange={(v) => setFormData({...formData, environment: v})} required>
                      <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-none font-bold">
                        <SelectValue placeholder="Environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="street">Open Street</SelectItem>
                        <SelectItem value="sewer">Sewer / Canal</SelectItem>
                        <SelectItem value="high">Rooftop / Tree</SelectItem>
                        <SelectItem value="locked">Private Property</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Address / Landmarks..." 
                        className="h-14 rounded-xl bg-gray-50 border-none flex-1 font-medium"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                      />
                      <Button 
                        type="button" 
                        onClick={handleLocationClick}
                        className={`h-14 w-14 rounded-xl transition-all shadow-md ${formData.coordinates ? 'bg-green-500' : 'bg-[#f6931d]'} text-white`}
                      >
                        <MapPin size={24} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 4: Contact */}
              <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white ring-1 ring-gray-100">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 text-[#f6931d]">
                    <div className="p-2 bg-orange-50 rounded-lg"><Users size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-[#2c5f51]">4. Contact Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Name" required className="h-14 rounded-xl bg-gray-50 border-none font-bold" 
                      onChange={(e) => setFormData({...formData, reporterName: e.target.value})} />
                    <Input placeholder="Phone" required type="tel" className="h-14 rounded-xl bg-gray-50 border-none font-bold" 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <Input placeholder="Alt Phone" type="tel" className="h-14 rounded-xl bg-gray-50 border-none font-bold" 
                      onChange={(e) => setFormData({...formData, altPhone: e.target.value})} />
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-[#2c5f51] hover:bg-[#1a3a32] text-white rounded-[1.5rem] font-black uppercase py-9 shadow-2xl transition-all active:scale-95 flex gap-3 text-xl tracking-widest">
                <Send size={24} /> <span>Dispatch Rescue Team</span>
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 self-start">
            <div className="bg-[#2c5f51] p-8 rounded-[2.5rem] text-white shadow-2xl">
              <h4 className="font-black uppercase tracking-tighter text-2xl mb-6 italic text-[#f6931d]">Rescue Tips</h4>
              <ul className="space-y-6 text-sm font-medium">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-black text-[#f6931d]">1</div>
                  <p>Do not touch aggressive animals. Maintain 2m distance.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-black text-[#f6931d]">2</div>
                  <p>Stay at the location if safe until the team arrives.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
              <Camera size={48} className="text-[#f6931d] mx-auto mb-4" />
              <h4 className="font-black uppercase tracking-tighter text-[#2c5f51] mb-2 text-xl">Visual Evidence</h4>
              <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 border-dashed mt-4">
                <span className="block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">Rescue Zalo</span>
                <span className="text-2xl font-black text-[#f6931d]">0988 015 445</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};