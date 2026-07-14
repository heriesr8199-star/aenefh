document.addEventListener('DOMContentLoaded', async () => {
    const memberList = document.getElementById('member-list');
    const topChatList = document.getElementById('top-chat-list');
    const totalMemberText = document.getElementById('total-member');
    const searchInput = document.getElementById('search-input');

    let members = []; 

    try {
        console.log("⏳ Sedang menarik data dari server...");
        
        const respon = await fetch('https://back-ultraw-fall-longer.trycloudflare.com');
        
        if (!respon.ok) throw new Error("File JSON tidak ditemukan!");
        const dataServer = await respon.json();
        
        members = dataServer.members.map(m => {
            return {
                nama: m.nama,
                role: m.role,
                chat: Math.floor(Math.random() * 1500) + 10 
            };
        });

        console.log("✅ Data sukses ditarik!");

        // 1. FUNGSI RENDER LEADERBOARD (Pajangan)
        function renderTopChat() {
            if (!topChatList) return;
            topChatList.innerHTML = ''; 
            
            [...members].sort((a, b) => b.chat - a.chat).slice(0, 5).forEach((m, i) => {
                const div = document.createElement('div');
                div.style.padding = "8px 0";
                div.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span><strong>${i + 1}. ${m.nama}</strong></span>
                        <span style="color:#00f260;">${m.chat} Pesan</span>
                    </div>
                `;
                topChatList.appendChild(div);
            });
        }

                // 2. FUNGSI RENDER DAFTAR MEMBER DENGAN SISTEM KASTA & VIP
        function renderList(data) {
            if (!memberList) return;
            memberList.innerHTML = '';
            
            if (totalMemberText) totalMemberText.innerText = data.length;

            const dataUrutKasta = [...data].sort((a, b) => {
                // 1. Cek VIP Khusus (Hayase Softspoken selalu di atas)
                if (a.nama === "Hayase Softspoken") return -1;
                if (b.nama === "Hayase Softspoken") return 1;

                // 2. Kasta Utama
                const kasta = { "Owner": 1, "Admin": 2, "Member": 3 };
                const nilaiA = kasta[a.role] || 99;
                const nilaiB = kasta[b.role] || 99;
                
                return nilaiA - nilaiB;
            });

            dataUrutKasta.forEach(member => {
                const li = document.createElement('li');
                
                // Styling: Hijau buat Hayase, Gold buat Admin/Owner, putih buat member
                let style = 'color: white;';
                if (member.nama === "Hayase Softspoken") {
                    style = 'color: #00ff66; font-weight: bold;'; // Warna HIJAU khusus Hayase
                } else if (member.role === 'Admin' || member.role === 'Owner') {
                    style = 'color: gold;'; // Warna GOLD buat Admin
                }

                li.innerHTML = `
                    <div class="member-info">
                        <span class="member-name" style="${style}">${member.nama}</span>
                        <span class="member-role" style="${style}">${member.role}</span>
                    </div>
                    <div class="status-online">
                        <div class="status-dot"></div> Online
                    </div>
                `;
                memberList.appendChild(li);
            });
        }


        // --- JALANKAN SEMUA ---
        renderTopChat();
        renderList(members);

        // --- FUNGSI SEARCH ---
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                renderList(members.filter(m => m.nama.toLowerCase().includes(val)));
            });
        }

    } catch (error) {
        console.error("❌ Gagal load data Puh:", error);
        if (memberList) {
            memberList.innerHTML = `<li><div style="color: red; padding: 10px;">Gagal memuat data member.</div></li>`;
        }
    }
});
